#!/usr/bin/env node
// Runtime matrix: generate a pairwise-covering set of configs, then for each one
// install -> build -> typecheck -> lint -> unit tests -> migrate -> start -> probe over HTTP.
// Postgres (pgvector), Redis and MongoDB run in throwaway Docker containers.
//
// Usage: pnpm build && node scripts/matrix/runtime.mjs [--jobs 3] [--only 1,4,9] [--out DIR] [--keep] [--list]
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pairwise, toConfig, effectiveChoice } from './space.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const core = await import(path.join(ROOT, 'packages/core/dist/index.js'));
const { generateProjectVfs, normalizeConfig, TransactionalFlusher, layoutFor } = core;

const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : dflt;
};
const JOBS = Number(arg('jobs', Math.max(1, Math.min(3, Math.floor(os.cpus().length / 3)))));
const OUT = path.resolve(arg('out', fs.mkdtempSync(path.join(os.tmpdir(), 'forgestack-runtime-'))));
fs.mkdirSync(OUT, { recursive: true });
const ONLY = arg('only') ? new Set(arg('only').split(',').map(Number)) : null;
// Each project's node_modules is ~0.5 GB; delete projects once checked unless --keep (logs stay).
const KEEP = process.argv.includes('--keep');

const SERVICES = {
  pg: { name: 'forgestack-matrix-pg', image: 'pgvector/pgvector:pg16', port: 45432, inner: 5432, env: ['POSTGRES_PASSWORD=postgres'] },
  redis: { name: 'forgestack-matrix-redis', image: 'redis:7-alpine', port: 46379, inner: 6379, env: [] },
  mongo: { name: 'forgestack-matrix-mongo', image: 'mongo:7', port: 47017, inner: 27017, env: [] },
};

// ---------- helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const freePort = () =>
  new Promise((res) => {
    const s = net.createServer();
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });

function run(cmd, cwd, env, log, timeoutMs = 10 * 60_000) {
  return new Promise((resolve) => {
    fs.appendFileSync(log, `\n$ (${path.relative(OUT, cwd) || '.'}) ${cmd}\n`);
    const child = spawn(cmd, { cwd, env, shell: true, detached: true });
    const out = fs.openSync(log, 'a');
    child.stdout.on('data', (d) => fs.writeSync(out, d));
    child.stderr.on('data', (d) => fs.writeSync(out, d));
    const timer = setTimeout(() => kill(child), timeoutMs);
    child.on('close', (code) => {
      clearTimeout(timer);
      fs.closeSync(out);
      resolve(code === 0);
    });
  });
}
function start(cmd, cwd, env, log) {
  fs.appendFileSync(log, `\n$ (${path.relative(OUT, cwd) || '.'}) ${cmd} &\n`);
  const out = fs.openSync(log, 'a');
  return spawn(cmd, { cwd, env, shell: true, detached: true, stdio: ['ignore', out, out] });
}
function kill(child) {
  try {
    process.kill(-child.pid, 'SIGKILL');
  } catch {
    // already exited
  }
}
async function http(url, opts = {}) {
  try {
    const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(10_000) });
    return { status: res.status, body: await res.text(), headers: res.headers };
  } catch (e) {
    return { status: 0, body: String(e.cause?.code ?? e.message) };
  }
}
async function waitFor(url, ms = 60_000, ok = (r) => r.status >= 200 && r.status < 500) {
  const end = Date.now() + ms;
  let last;
  while (Date.now() < end) {
    last = await http(url);
    if (last.status && ok(last)) return last;
    await sleep(750);
  }
  return last;
}

const hasSql = (dir) =>
  fs.readdirSync(dir, { recursive: true }).some((f) => String(f).endsWith('.sql') && !String(f).includes('node_modules'));

// ---------- services ----------
function ensureServices() {
  for (const s of Object.values(SERVICES)) {
    const running = execFileSync('docker', ['ps', '-q', '-f', `name=^${s.name}$`]).toString().trim();
    if (running) continue;
    try {
      execFileSync('docker', ['rm', '-f', s.name], { stdio: 'ignore' });
    } catch {
      // no stale container to remove
    }
    execFileSync('docker', ['run', '-d', '--name', s.name, '-p', `127.0.0.1:${s.port}:${s.inner}`, ...s.env.flatMap((e) => ['-e', e]), s.image], { stdio: 'ignore' });
  }
  for (let i = 0; i < 60; i++) {
    try {
      execFileSync('docker', ['exec', SERVICES.pg.name, 'pg_isready', '-U', 'postgres'], { stdio: 'ignore' });
      return;
    } catch {
      execFileSync('sleep', ['1']);
    }
  }
  throw new Error('postgres container did not become ready');
}
const createPgDb = (db) => {
  execFileSync('docker', ['exec', SERVICES.pg.name, 'psql', '-U', 'postgres', '-c', `DROP DATABASE IF EXISTS ${db} WITH (FORCE)`], { stdio: 'ignore' });
  execFileSync('docker', ['exec', SERVICES.pg.name, 'psql', '-U', 'postgres', '-c', `CREATE DATABASE ${db}`], { stdio: 'ignore' });
  execFileSync('docker', ['exec', SERVICES.pg.name, 'psql', '-U', 'postgres', '-d', db, '-c', 'CREATE EXTENSION IF NOT EXISTS vector'], { stdio: 'ignore' });
};

// ---------- one config ----------
async function verify(id, cfg) {
  const name = `m${String(id).padStart(2, '0')}`;
  const dir = path.join(OUT, name);
  const log = path.join(OUT, `${name}.log`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.writeFileSync(log, JSON.stringify(effectiveChoice(cfg)) + '\n');
  cfg = { ...cfg, name, targetPath: dir };
  const steps = [];
  const step = async (label, fn) => {
    const ok = await fn();
    steps.push({ label, ok });
    return ok;
  };

  const layout = layoutFor(cfg);
  const pm = cfg.packageManager;
  const runScript = (s) => (pm === 'npm' ? `npm run ${s}` : `${pm} run ${s}`);
  const db = cfg.backend.database;
  const env = {
    ...process.env,
    // Not NODE_ENV=production here: npm/pnpm would skip devDependencies (tsc, turbo, vite) on install.
    CI: '1',
    DATABASE_URL:
      db === 'postgres'
        ? `postgresql://postgres:postgres@127.0.0.1:${SERVICES.pg.port}/${name}`
        : db === 'mongodb'
        ? `mongodb://127.0.0.1:${SERVICES.mongo.port}/${name}`
        : db === 'sqlite'
        ? `file:${path.join(dir, layout.backendDir, 'dev.db')}`
        : '',
    MONGODB_URI: `mongodb://127.0.0.1:${SERVICES.mongo.port}/${name}`,
    REDIS_URL: `redis://127.0.0.1:${SERVICES.redis.port}`,
    BETTER_AUTH_SECRET: 'matrix_secret_key_that_is_at_least_32_chars_long',
    OPENAI_API_KEY: 'sk-matrix-placeholder',
    CORS_ORIGIN: 'http://localhost:3000',
  };
  const pkgAt = (d) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(dir, d, 'package.json'), 'utf8'));
    } catch {
      return null;
    }
  };

  await step('generate', async () => {
    const vfs = await generateProjectVfs(cfg);
    await TransactionalFlusher.flush(vfs, dir);
    return true;
  });
  const root = pkgAt('');
  if (!(await step('install', () => run(`${pm} install`, dir, env, log, 15 * 60_000)))) return { id, name, cfg, steps };
  for (const s of ['build', 'typecheck', 'lint', 'test']) {
    if (root?.scripts?.[s]) await step(s, () => run(runScript(s), dir, env, log));
  }

  const procs = [];
  try {
    // ---- backend server (separate API app, or Next.js serving its own API) ----
    const beDir = path.join(dir, layout.backendDir);
    const bePkg = pkgAt(layout.backendDir);
    const hasApi = cfg.backend.framework !== 'none' || layout.nextIsServer;
    if (hasApi && bePkg) {
      if (db === 'postgres') createPgDb(name);
      if (db === 'postgres' || db === 'sqlite') {
        if (cfg.backend.orm === 'drizzle' && bePkg.scripts?.['db:generate']) {
          // drizzle-kit exits 0 even when it fails to load the schema, so require real SQL output.
          await step('migrate', async () => {
            const generated = (await run(runScript('db:generate'), beDir, env, log)) && hasSql(beDir);
            if (!generated) fs.appendFileSync(log, '\n[probe] db:generate produced no .sql migration\n');
            return generated && run(runScript('db:migrate'), beDir, env, log);
          });
        } else if (cfg.backend.orm === 'prisma') {
          await step('migrate', () => run(`${pm === 'npm' ? 'npx' : `${pm} exec`} prisma db push --skip-generate`, beDir, env, log));
        }
      }
      const port = await freePort();
      const base = `http://127.0.0.1:${port}`;
      const startCmd = layout.nextIsServer ? `${pm === 'npm' ? 'npx' : `${pm} exec`} next start -p ${port}` : runScript('start');
      procs.push(start(startCmd, beDir, { ...env, NODE_ENV: 'production', PORT: String(port), BETTER_AUTH_URL: base }, log));

      const healthPath = layout.nextIsServer ? '/' : '/api/health';
      await step('server: GET ' + healthPath, async () => (await waitFor(base + healthPath, 90_000, (r) => r.status === 200))?.status === 200);

      if (cfg.auth === 'better-auth') {
        const email = `${name}@example.com`;
        const body = JSON.stringify({ email, password: 'Matrix-Passw0rd!', name });
        const headers = { 'content-type': 'application/json', origin: base };
        await step('auth: sign-up', async () => {
          const r = await http(`${base}/api/auth/sign-up/email`, { method: 'POST', headers, body });
          fs.appendFileSync(log, `\n[probe] sign-up -> ${r.status} ${r.body.slice(0, 300)}\n`);
          return r.status === 200;
        });
        await step('auth: sign-in', async () => {
          const r = await http(`${base}/api/auth/sign-in/email`, { method: 'POST', headers, body: JSON.stringify({ email, password: 'Matrix-Passw0rd!' }) });
          fs.appendFileSync(log, `\n[probe] sign-in -> ${r.status} ${r.body.slice(0, 300)}\n`);
          return r.status === 200 && Boolean(r.headers?.get('set-cookie'));
        });
      }
      if (cfg.rpc === 'trpc' && !layout.nextIsServer) {
        await step('trpc: health query', async () => {
          const r = await http(`${base}/api/trpc/health`);
          fs.appendFileSync(log, `\n[probe] trpc -> ${r.status} ${r.body.slice(0, 200)}\n`);
          return r.status === 200 && r.body.includes('ok');
        });
      }
    }

    // ---- worker ----
    if (cfg.queue === 'bullmq' && bePkg?.scripts?.['worker:build']) {
      if (await step('worker: build', () => run(runScript('worker:build'), beDir, env, log))) {
        const w = start('node dist/worker.js', beDir, env, log);
        procs.push(w);
        await sleep(6000);
        await step('worker: stays up', async () => w.exitCode === null);
      }
    }

    // ---- Vite frontend ----
    const fePkg = cfg.frontend.framework === 'react-vite' ? pkgAt(layout.frontendPkgDir) : null;
    const viteDir = path.join(dir, layout.frontendPkgDir);
    if (fePkg && fs.existsSync(path.join(viteDir, 'dist', 'index.html'))) {
      const port = await freePort();
      procs.push(start(`${pm === 'npm' ? 'npx' : `${pm} exec`} vite preview --port ${port} --strictPort --host 127.0.0.1`, viteDir, env, log));
      await step('frontend: GET /', async () => {
        const r = await waitFor(`http://127.0.0.1:${port}/`, 30_000, (x) => x.status === 200);
        return r?.status === 200 && /<div id="(root|app)"/.test(r.body);
      });
    }
  } finally {
    procs.forEach(kill);
  }
  return { id, name, cfg, steps };
}

// ---------- main ----------
const { choices, totalPairs, unreachable } = pairwise(normalizeConfig, {
  restrict: { packageManager: ['pnpm', 'npm'] }, // yarn/bun aren't installed here; covered by the static matrix
});
const configs = choices.map((c) => normalizeConfig(toConfig(c)));
console.log(`Pairwise set: ${configs.length} configs cover ${totalPairs - unreachable} value pairs (${unreachable} only reachable via normalization).`);
if (process.argv.includes('--list')) {
  configs.forEach((c, i) => console.log(i + 1, JSON.stringify(effectiveChoice(c))));
  process.exit(0);
}
ensureServices();
console.log(`Output: ${OUT}   jobs: ${JOBS}`);

const queue = configs.map((c, i) => [i + 1, c]).filter(([id]) => !ONLY || ONLY.has(id));
const results = [];
await Promise.all(
  Array.from({ length: JOBS }, async () => {
    while (queue.length) {
      const [id, cfg] = queue.shift();
      let r;
      try {
        r = await verify(id, cfg);
      } catch (e) {
        r = { id, name: `m${String(id).padStart(2, '0')}`, cfg, steps: [{ label: `runner error: ${e.message}`, ok: false }] };
      }
      if (!KEEP) fs.rmSync(path.join(OUT, r.name), { recursive: true, force: true });
      results.push(r);
      const bad = r.steps.filter((s) => !s.ok).map((s) => s.label);
      const e = effectiveChoice(r.cfg);
      console.log(`${bad.length ? '❌' : '✅'} ${r.name} ${e.topology}/${e.feFramework}/${e.backend}/${e.dbOrm}/auth=${e.auth}/rpc=${e.rpc}/${e.packageManager}${bad.length ? '  FAILED: ' + bad.join(', ') : `  (${r.steps.length} steps)`}`);
    }
  })
);

results.sort((a, b) => a.id - b.id);
const lines = ['| # | config | result |', '|---|---|---|'];
for (const r of results) {
  const e = effectiveChoice(r.cfg);
  lines.push(`| ${r.name} | ${Object.entries(e).map(([k, v]) => `${k}=${v}`).join(' ')} | ${r.steps.map((s) => `${s.ok ? '✅' : '❌'} ${s.label}`).join('<br>')} |`);
}
fs.writeFileSync(path.join(OUT, 'report.md'), lines.join('\n') + '\n');
const failed = results.filter((r) => r.steps.some((s) => !s.ok));
console.log(`\n${results.length - failed.length}/${results.length} configs passed every step. Report: ${path.join(OUT, 'report.md')}`);
process.exit(failed.length ? 1 : 0);
