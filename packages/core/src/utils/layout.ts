import type { ProjectConfig } from '../types/config.js';

/**
 * Where each part of a generated project lives. Every slice resolves paths through this,
 * so topologies can't drift apart (e.g. one slice writing ai-agent-rag's auth to `apps/api`
 * and another writing it to a dead root `src/`).
 */
export interface ProjectLayout {
  /** apps/* + packages/* workspace */
  isWorkspace: boolean;
  /** Next.js serves the API itself (no separate backend app) */
  nextIsServer: boolean;
  /** Folder of the frontend's source tree */
  frontendDir: string;
  /** Folder of the frontend's package.json (differs for Electron: code in src/renderer, package at root) */
  frontendPkgDir: string;
  /** Folder of the backend app (the Next app when Next is the server) */
  backendDir: string;
  fe: (p: string) => string;
  fePkg: (p: string) => string;
  be: (p: string) => string;
}

const join = (dir: string) => (p: string) => (dir ? `${dir}/${p}` : p);

export function layoutFor(config: ProjectConfig): ProjectLayout {
  const t = config.topology;
  const isWorkspace = t === 'monorepo' || t === 'ai-agent-rag' || t === 'micro-frontend';
  const frontendDir =
    t === 'monorepo' || t === 'ai-agent-rag'
      ? 'apps/web'
      : t === 'micro-frontend'
      ? 'apps/shell'
      : t === 'separate-folders'
      ? 'frontend'
      : t === 'electron-desktop'
      ? 'src/renderer'
      : '';
  const frontendPkgDir = t === 'electron-desktop' ? '' : frontendDir;
  const nextIsServer = config.frontend.framework === 'nextjs' && config.backend.framework === 'none';
  const apiDir = isWorkspace ? 'apps/api' : t === 'separate-folders' ? 'backend' : t === 'electron-desktop' ? 'server' : '';
  const backendDir = nextIsServer ? frontendPkgDir : apiDir;
  return {
    isWorkspace,
    nextIsServer,
    frontendDir,
    frontendPkgDir,
    backendDir,
    fe: join(frontendDir),
    fePkg: join(frontendPkgDir),
    be: join(backendDir),
  };
}
