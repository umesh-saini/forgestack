export type FileActionType =
  | 'CREATE'
  | 'OVERWRITE'
  | 'MERGE_JSON'
  | 'PATCH_AST'
  | 'APPEND'
  | 'DELETE';

export interface VirtualFile {
  path: string;
  content: string;
  encoding?: BufferEncoding;
  executable?: boolean;
}

export interface CreateFileAction {
  type: 'CREATE';
  path: string;
  content: string;
  executable?: boolean;
}

export interface OverwriteFileAction {
  type: 'OVERWRITE';
  path: string;
  content: string;
  executable?: boolean;
}

export interface MergeJsonAction {
  type: 'MERGE_JSON';
  path: string;
  content: Record<string, unknown> | string;
  merger?: (existing: Record<string, unknown>, incoming: Record<string, unknown>) => Record<string, unknown>;
}

export interface PatchAstAction {
  type: 'PATCH_AST';
  path: string;
  patcher: (existingContent: string) => string;
}

export interface AppendFileAction {
  type: 'APPEND';
  path: string;
  content: string;
}

export interface DeleteFileAction {
  type: 'DELETE';
  path: string;
}

export type FileAction =
  | CreateFileAction
  | OverwriteFileAction
  | MergeJsonAction
  | PatchAstAction
  | AppendFileAction
  | DeleteFileAction;

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: TreeNode[];
  size?: number;
}
