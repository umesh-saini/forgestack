// Static integrity checks for a generated project (no install needed).
// checkProject(files, config) -> string[] of problems; empty means the project is internally consistent:
//   - every JSON file parses
//   - every relative import / tsconfig `paths` alias resolves to a generated file
//   - every bare import is declared in the nearest package.json (or the workspace root)
//   - every binary a package.json script runs is provided by a declared dependency
//   - every `workspace:*` dependency names a generated package, and the package manager supports it
//   - every tsconfig `extends` resolves
import { builtinModules } from 'node:module';
import path from 'node:path/posix';

const CODE = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const SKIP_DIRS = /^(\.agents|\.cursor|\.claude|\.github|openspec|docs|\.windsurf|\.clinerules|\.gsd|\.specify|specs)\//;
const IMPORT_RE = [
  /(?:^|[\s;])(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,$]*?\s+from\s+)?['"]([^'"\n]+)['"]/gm,
  /\bimport\(\s*['"]([^'"\n]+)['"]\s*\)/g,
  /\brequire\(\s*['"]([^'"\n]+)['"]\s*\)/g,
];
const BUILTINS = new Set(builtinModules);
const SHELL = new Set(['node', 'npm', 'pnpm', 'yarn', 'bun', 'bunx', 'npx', 'cd', 'rm', 'echo', 'cp', 'mv', 'mkdir', 'exit', 'true', 'false', 'sh', 'bash', 'docker', 'cargo', 'git', 'test', '[', 'cross-env', 'exec', 'env']);
const BIN_TO_PKG = {
  tsc: 'typescript', 'drizzle-kit': 'drizzle-kit', biome: '@biomejs/biome', playwright: '@playwright/test',
  tauri: '@tauri-apps/cli', 'electron-vite': 'electron-vite', 'electron-builder': 'electron-builder',
  cypress: 'cypress', 'pino-pretty': 'pino-pretty', wrangler: 'wrangler', vercel: 'vercel',
};
const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts', '.d.ts', '/index.ts', '/index.tsx', '/index.js'];

const pkgNameOf = (spec) => (spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]);
const parseJson = (s) => JSON.parse(s.replace(/^\uFEFF/, ''));

export function checkProject(files, config) {
  const problems = [];
  const byPath = new Map(files.map((f) => [f.path.replace(/^\.\//, ''), f.content]));
  const has = (p) => byPath.has(p);
  const json = new Map();

  for (const [p, content] of byPath) {
    if (!p.endsWith('.json')) continue;
    try {
      json.set(p, parseJson(content));
    } catch (e) {
      // tsconfig files may legally contain comments; everything else must be strict JSON
      if (!/tsconfig[^/]*\.json$/.test(p)) problems.push(`${p}: invalid JSON (${e.message})`);
    }
  }

  const pkgJsonPaths = [...json.keys()].filter((p) => p === 'package.json' || p.endsWith('/package.json'));
  const pkgs = new Map(pkgJsonPaths.map((p) => [path.dirname(p) === '.' ? '' : path.dirname(p), json.get(p)]));
  const workspaceNames = new Map([...pkgs].filter(([, pkg]) => pkg?.name).map(([dir, pkg]) => [pkg.name, dir]));
  const root = pkgs.get('') ?? {};
  const depsOf = (pkg) => ({ ...pkg?.dependencies, ...pkg?.devDependencies, ...pkg?.peerDependencies, ...pkg?.optionalDependencies });

  const nearestPkgDir = (fileDir) => {
    let d = fileDir;
    while (true) {
      if (pkgs.has(d)) return d;
      if (d === '' || d === '.') return pkgs.has('') ? '' : null;
      d = path.dirname(d);
      if (d === '.') d = '';
    }
  };
  const declared = (pkgDir, name) => {
    const own = depsOf(pkgs.get(pkgDir));
    const rootDeps = depsOf(root);
    const typesName = `@types/${name.startsWith('@') ? name.slice(1).replace('/', '__') : name}`;
    return Boolean(own[name] || rootDeps[name] || own[typesName] || rootDeps[typesName] || pkgs.get(pkgDir)?.name === name);
  };
  const resolveFile = (base) => {
    const candidates = [base];
    const m = base.match(/\.(m?js|jsx)$/);
    if (m) candidates.push(base.replace(/\.(m?js|jsx)$/, m[1] === 'mjs' ? '.mts' : '.ts'), base.replace(/\.(m?js|jsx)$/, '.tsx'));
    for (const e of EXTS) candidates.push(base + e);
    return candidates.some((c) => has(c));
  };
  const tsconfigFor = (fileDir) => {
    let d = fileDir;
    while (true) {
      const p = d ? `${d}/tsconfig.json` : 'tsconfig.json';
      if (json.has(p)) return { dir: d, cfg: json.get(p) };
      if (!d) return null;
      d = path.dirname(d);
      if (d === '.') d = '';
    }
  };

  // Module Federation remotes are resolved at runtime, not from node_modules.
  const federationRemotes = new Set();
  for (const [p, content] of byPath) {
    if (!/vite\.config\.[cm]?[tj]s$/.test(p) || !content.includes('federation(')) continue;
    const block = content.match(/remotes:\s*\{([\s\S]*?)\n\s{6}\}/);
    for (const m of (block?.[1] ?? '').matchAll(/^\s{8}(\w+):/gm)) federationRemotes.add(m[1]);
  }

  // --- imports ---
  for (const [file, content] of byPath) {
    if (!CODE.test(file) || SKIP_DIRS.test(file) || file.includes('/node_modules/')) continue;
    const dir = path.dirname(file) === '.' ? '' : path.dirname(file);
    if (content.includes('FORGESTACK_')) problems.push(`${file}: leftover FORGESTACK_ injection slot`);
    if (content.includes('import.meta.env')) {
      const pkgDir = nearestPkgDir(dir) ?? '';
      const deps = depsOf(pkgs.get(pkgDir));
      const isVite = deps.vite || deps['electron-vite'];
      const hasViteTypes = [...byPath].some(([p, c]) => p.startsWith(pkgDir) && p.endsWith('.d.ts') && c.includes('vite/client'));
      if (isVite && !hasViteTypes) problems.push(`${file}: uses import.meta.env but its package has no vite/client types`);
      if (!isVite) problems.push(`${file}: uses import.meta.env outside a Vite package`);
    }
    const specs = new Set();
    for (const re of IMPORT_RE) for (const m of content.matchAll(re)) specs.add(m[1]);
    for (const spec of specs) {
      if (spec.startsWith('.')) {
        if (!resolveFile(path.normalize(path.join(dir, spec)))) problems.push(`${file}: cannot resolve '${spec}'`);
        continue;
      }
      if (spec.startsWith('node:') || BUILTINS.has(spec) || BUILTINS.has(spec.split('/')[0]) || spec.startsWith('virtual:')) continue;
      // tsconfig path aliases (e.g. '@/*' -> './src/*')
      const ts = tsconfigFor(dir);
      const paths = ts?.cfg?.compilerOptions?.paths ?? {};
      const alias = Object.keys(paths).find((k) => (k.endsWith('/*') ? spec.startsWith(k.slice(0, -1)) : spec === k));
      if (alias) {
        const baseUrl = path.join(ts.dir, ts.cfg.compilerOptions.baseUrl ?? '.');
        const rest = alias.endsWith('/*') ? spec.slice(alias.length - 1) : '';
        const ok = paths[alias].some((t) => resolveFile(path.normalize(path.join(baseUrl, t.replace('*', rest)))));
        if (!ok) problems.push(`${file}: alias import '${spec}' does not resolve`);
        continue;
      }
      const name = pkgNameOf(spec);
      if (federationRemotes.has(name)) continue;
      const pkgDir = nearestPkgDir(dir);
      if (pkgDir === null) problems.push(`${file}: imports '${name}' but has no package.json`);
      else if (!declared(pkgDir, name)) problems.push(`${file}: imports '${name}', not declared in ${pkgDir ? pkgDir + '/' : ''}package.json`);
    }
  }

  // --- package.json scripts, workspace deps ---
  const pm = config.packageManager;
  for (const [dir, pkg] of pkgs) {
    const where = `${dir ? dir + '/' : ''}package.json`;
    for (const [script, cmd] of Object.entries(pkg?.scripts ?? {})) {
      for (const part of String(cmd).split(/&&|\|\||;|\|/)) {
        const tokens = part.trim().split(/\s+/).filter((t) => !/^\w+=/.test(t));
        const bin = tokens[0];
        if (!bin || SHELL.has(bin) || bin.startsWith('.') || bin.startsWith('$')) continue;
        const providers = [BIN_TO_PKG[bin], bin].filter(Boolean);
        if (!providers.some((p) => declared(dir, p))) problems.push(`${where}: script '${script}' runs '${bin}', which no declared dependency provides`);
      }
    }
    for (const [dep, version] of Object.entries(depsOf(pkg))) {
      if (!String(version).startsWith('workspace:')) continue;
      if (!workspaceNames.has(dep)) problems.push(`${where}: depends on '${dep}' (workspace) but no such package is generated`);
      if (pm === 'npm') problems.push(`${where}: uses 'workspace:' protocol, which npm does not support`);
    }
  }
  if (pkgs.size > 1 && [...pkgs.values()].some((p) => Object.values(depsOf(p)).some((v) => String(v).startsWith('workspace:')))) {
    if (pm === 'pnpm' && !has('pnpm-workspace.yaml')) problems.push(`pnpm-workspace.yaml missing for a multi-package pnpm project`);
    if (pm !== 'pnpm' && !root.workspaces) problems.push(`package.json: no "workspaces" field, so ${pm} won't link workspace packages`);
  }
  if (root.packageManager && !String(root.packageManager).startsWith(`${pm}@`)) {
    problems.push(`package.json: packageManager is '${root.packageManager}' but project was generated for ${pm}`);
  }

  // --- tsconfig extends ---
  for (const [p, cfg] of json) {
    if (!/tsconfig[^/]*\.json$/.test(p) || !cfg?.extends) continue;
    const dir = path.dirname(p) === '.' ? '' : path.dirname(p);
    for (const ext of [].concat(cfg.extends)) {
      if (ext.startsWith('.')) {
        if (!has(path.normalize(path.join(dir, ext)))) problems.push(`${p}: extends '${ext}', which does not exist`);
      } else {
        const name = pkgNameOf(ext);
        const target = workspaceNames.get(name);
        if (target !== undefined) {
          const sub = ext.slice(name.length + 1) || 'tsconfig.json';
          if (!has(path.join(target, sub))) problems.push(`${p}: extends '${ext}', but ${path.join(target, sub)} is not generated`);
          if (!declared(nearestPkgDir(dir) ?? '', name)) problems.push(`${p}: extends '${name}', not declared as a dependency`);
        } else if (!declared(nearestPkgDir(dir) ?? '', name)) {
          problems.push(`${p}: extends '${ext}' from undeclared package '${name}'`);
        }
      }
    }
  }
  return problems;
}
