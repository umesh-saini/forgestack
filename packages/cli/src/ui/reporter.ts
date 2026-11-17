import * as p from '@clack/prompts';
import color from 'picocolors';
import type { ProjectConfig } from '@forgestack/core';

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

  public static printSummary(config: ProjectConfig, targetDir: string): void {
    const isMonorepo = config.topology === 'monorepo';

    p.note(
      `Project Name:   ${color.green(config.name)}
Topology:       ${color.yellow(config.topology)}
Frontend:       ${color.cyan(config.frontend.framework)} (${config.frontend.state}, ${config.frontend.styling})
Backend:        ${color.magenta(config.backend.framework)} (${config.backend.database} + ${config.backend.orm})
AI Governance:  ${color.blue('Cursor Rules + OpenSpec + Clean Architecture Skills')}
Location:       ${color.dim(targetDir)}`,
      'ForgeStack Configuration Summary'
    );

    const steps = [
      `cd ${config.name}`,
      ...(config.install ? [] : [`${config.packageManager} install`]),
      isMonorepo ? `${config.packageManager} dev` : `${config.packageManager} run dev`,
    ];

    p.outro(
      `${color.green('✔')} Project setup complete! Next steps:\n\n` +
        steps.map((s) => `  ${color.cyan('$')} ${color.bold(s)}`).join('\n')
    );
  }
}
