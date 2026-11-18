import color from 'picocolors';

export class CliSplash {
  public static showWelcome(): void {
    console.log();
    console.log(
      color.bold(color.cyan('  ForgeStack')) +
        color.dim(' • The AI-Native Full-Stack Architecture Platform')
    );
    console.log(
      color.dim('  ═══════════════════════════════════════════════════════════════')
    );
    console.log();
    console.log(
      `  ${color.bold('Welcome to ForgeStack')}`
    );
    console.log(
      `  ${color.dim('Scaffold production-grade monorepos, desktop apps, and AI systems')}`
    );
    console.log();
    console.log(`  ${color.bold('This setup will configure:')}`);
    console.log(
      `    ${color.cyan('•')} ${color.bold('Architecture Topology')}: Monorepo, Micro-Frontend, Tauri v2, or AI RAG`
    );
    console.log(
      `    ${color.cyan('•')} ${color.bold('End-to-End Type Safety')}: tRPC v11, Zod Contracts & Strict TypeScript`
    );
    console.log(
      `    ${color.cyan('•')} ${color.bold('Persistence & Auth')}: PostgreSQL (Drizzle/Prisma), SQLite, Better-Auth`
    );
    console.log(
      `    ${color.cyan('•')} ${color.bold('AI Governance & MCP')}: Cursor Rules, Agent Skills & @repo/mcp-server`
    );
    console.log();
    console.log(`  ${color.bold('Quick start after setup:')}`);
    console.log(
      `    ${color.yellow('pnpm dev')}           ${color.dim('Start local dev server and containers')}`
    );
    console.log(
      `    ${color.yellow('pnpm test')}          ${color.dim('Execute Vitest and Playwright E2E suites')}`
    );
    console.log(
      `    ${color.yellow('npx openspec check')} ${color.dim('Validate architecture specifications')}`
    );
    console.log();
    console.log(
      color.dim('  ───────────────────────────────────────────────────────────────')
    );
    console.log();
  }
}
