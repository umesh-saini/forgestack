export type LogTone = 'info' | 'ok' | 'error' | 'muted';

export interface LogLine {
  /** ms since epoch */
  at: number;
  /** short source tag, e.g. "vfs", "write", "git" */
  tag: string;
  text: string;
  tone?: LogTone;
}

export type PhaseStatus = 'pending' | 'running' | 'done' | 'error';

export interface Phase {
  id: string;
  label: string;
  detail?: string;
  status: PhaseStatus;
}

export const log = (tag: string, text: string, tone: LogTone = 'info'): LogLine => ({ at: Date.now(), tag, text, tone });
