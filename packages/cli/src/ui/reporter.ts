import * as p from '@clack/prompts';
import path from 'node:path';
import color from 'picocolors';
import type { ProjectConfig } from '@forgestk/core';

export class CliReporter {
  public static printBanner(): void {
    console.log(
      color.cyan(`
  ███████╗ ██████╗ ██████╗  ██████╗ ███████╗███████╗████████╗ █████╗  ██████╗██╗  ██╗
  ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  ███████╗   ██║   ███████║██║     █████╔╝ 
  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
  ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗███████║   ██║   ██║  ██║╚██████╗██║  ██╗
  ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
    `)
    );
  }

  public static printSummary(config: ProjectConfig, targetDir: string, fileCount?: number, installFailed = false): void {
    const isCurrentDir = targetDir === process.cwd();

    const primitives: string[] = [];
    if (config.auth === 'better-auth') primitives.push('Better-Auth');
    if (config.rpc === 'trpc') primitives.push('tRPC v11');
    if (config.testing?.e2e === 'playwright') primitives.push('Playwright E2E');
    if (config.ci === 'github-actions') primitives.push('GitHub Actions CI');
    if (config.aiGovernance.mcp) primitives.push('Model Context Protocol (@repo/mcp-server)');

    const countBadge = fileCount ? color.green(` (${fileCount} files staged & written)`) : '';

    p.note(
      `Project Name:   ${color.green(color.bold(config.name))}${countBadge}
Topology:       ${color.yellow(config.topology)}
Frontend:       ${color.cyan(config.frontend.framework)} (${config.frontend.state}, ${config.frontend.styling})
Backend:        ${color.magenta(config.backend.framework)} (${config.backend.database} + ${config.backend.orm})
Primitives:     ${color.blue(primitives.length > 0 ? primitives.join(' • ') : 'Standard')}
AI Governance:  ${color.cyan('Cursor Rules + OpenSpec Workflows + Clean Code Skills')}
Location:       ${color.dim(targetDir)}`,
      'ForgeStack Architecture Summary'
    );

    const steps = [
      ...(isCurrentDir ? [] : [`cd ${path.basename(targetDir)}`]),
      ...(config.install && !installFailed ? [] : [`${config.packageManager} install`]),
      `${config.packageManager} run dev`,
    ];

    const headline = installFailed
      ? `${color.yellow('⚠')} Project files were created, but dependency installation failed (see error above). Fix it, then:`
      : `${color.green('✔')} Architecture synthesis complete! Quick start:`;
    p.outro(`${headline}\n\n` + steps.map((s) => `  ${color.cyan('$')} ${color.bold(s)}`).join('\n'));
  }
}
