import type { FeatureSlice } from '../../engine/compositor.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const dockerSlice: FeatureSlice = {
  id: 'container-docker',
  name: 'Docker & Containerization',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (!config.backend.container || config.backend.framework === 'none') {
      return;
    }

    const isMonorepo =
      config.topology === 'monorepo' ||
      config.topology === 'micro-frontend' ||
      config.topology === 'ai-agent-rag';
    const isSeparate = config.topology === 'separate-folders';
    const apiDockerfilePath = isMonorepo
      ? 'apps/api/Dockerfile'
      : isSeparate
      ? 'backend/Dockerfile'
      : 'Dockerfile';

    // 1. Multi-stage Dockerfile
    vfs.applyAction({
      type: 'CREATE',
      path: apiDockerfilePath,
      content: `# Multi-stage Dockerfile for Node.js ESM Backend
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@10.33.4

FROM base AS dependencies
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
${isMonorepo ? 'COPY apps/api/package.json ./apps/api/\nCOPY packages/ ./packages/' : ''}
RUN pnpm install --frozen-lockfile || pnpm install

FROM dependencies AS builder
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
USER nodejs

${
  isMonorepo
    ? 'COPY --from=builder /app/apps/api/dist ./dist\nCOPY --from=builder /app/apps/api/package.json ./\nCOPY --from=dependencies /app/node_modules ./node_modules'
    : 'COPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/package.json ./\nCOPY --from=dependencies /app/node_modules ./node_modules'
}

EXPOSE 4000
CMD ["node", "dist/server.js"]
`,
    });

    // 2. docker-compose.yml
    if (config.backend.database === 'postgres') {
      vfs.applyAction({
        type: 'CREATE',
        path: 'docker-compose.yml',
        content: `version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: ${apiDockerfilePath}
    ports:
      - '4000:4000'
    environment:
      - NODE_ENV=development
      - PORT=4000
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/app_dev?schema=public
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: ${config.topology === 'ai-agent-rag' ? 'pgvector/pgvector:pg16  # Postgres 16 + pgvector' : 'postgres:16-alpine'}
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_dev
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
`,
      });
    } else if (config.backend.database === 'mongodb') {
      vfs.applyAction({
        type: 'CREATE',
        path: 'docker-compose.yml',
        content: `version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: ${apiDockerfilePath}
    ports:
      - '4000:4000'
    environment:
      - NODE_ENV=development
      - PORT=4000
      - DATABASE_URL=mongodb://mongodb:27017/app_dev
    depends_on:
      mongodb:
        condition: service_healthy

  mongodb:
    image: mongo:7  # MongoDB publishes no Alpine images
    restart: always
    ports:
      - '27017:27017'
    volumes:
      - mongodata:/data/db
    healthcheck:
      test: ['CMD', 'mongosh', '--eval', 'db.adminCommand("ping")']
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  mongodata:
`,
      });
    }
  },
};
