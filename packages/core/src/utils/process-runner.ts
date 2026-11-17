import { spawn } from 'node:child_process';

export interface ProcessRunOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  onStdout?: (data: string) => void;
  onStderr?: (data: string) => void;
}

export interface ProcessResult {
  code: number;
  stdout: string;
  stderr: string;
}

export class ProcessRunner {
  /**
   * Spawns a child process and returns a promise resolving with output.
   */
  public static run(
    command: string,
    args: string[] = [],
    options: ProcessRunOptions = {}
  ): Promise<ProcessResult> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, ...options.env },
        shell: process.platform === 'win32',
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        const text = data.toString();
        stdout += text;
        options.onStdout?.(text);
      });

      child.stderr?.on('data', (data) => {
        const text = data.toString();
        stderr += text;
        options.onStderr?.(text);
      });

      child.on('error', (err) => {
        reject(new Error(`Failed to spawn command '${command}': ${err.message}`));
      });

      child.on('close', (code) => {
        const exitCode = code ?? 0;
        if (exitCode !== 0) {
          reject(
            new Error(
              `Command '${command} ${args.join(' ')}' exited with code ${exitCode}.\nStderr: ${stderr.trim()}`
            )
          );
        } else {
          resolve({ code: exitCode, stdout, stderr });
        }
      });
    });
  }

  /**
   * Initializes a git repository and creates an initial commit.
   */
  public static async initGit(
    cwd: string,
    onProgress?: (msg: string) => void
  ): Promise<void> {
    onProgress?.('Initializing git repository...');
    await this.run('git', ['init'], { cwd, onStdout: onProgress });

    onProgress?.('Adding files to git index...');
    await this.run('git', ['add', '-A'], { cwd, onStdout: onProgress });

    onProgress?.('Creating initial commit...');
    await this.run(
      'git',
      ['-c', 'user.name=ForgeStack', '-c', 'user.email=bot@forgestack.dev', 'commit', '-m', 'feat: initial scaffold by ForgeStack'],
      { cwd, onStdout: onProgress }
    );
  }

  /**
   * Runs package manager installation in the given target directory.
   */
  public static async installDependencies(
    cwd: string,
    pm: 'pnpm' | 'npm' | 'yarn' | 'bun' = 'pnpm',
    onProgress?: (chunk: string) => void
  ): Promise<void> {
    const installArgs = pm === 'yarn' ? [] : ['install'];
    await this.run(pm, installArgs, {
      cwd,
      onStdout: onProgress,
      onStderr: onProgress,
    });
  }
}
