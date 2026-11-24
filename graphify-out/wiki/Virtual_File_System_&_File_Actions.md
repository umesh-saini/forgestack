# Virtual File System & File Actions

> 20 nodes · cohesion 0.11

## Key Concepts

- **types.ts** (13 connections) — `packages/core/src/vfs/types.ts`
- **VirtualFile** (5 connections) — `packages/core/src/vfs/types.ts`
- **.applyAction()** (5 connections) — `packages/core/src/vfs/vfs.ts`
- **.normalizePath()** (5 connections) — `packages/core/src/vfs/vfs.ts`
- **FileAction** (4 connections) — `packages/core/src/vfs/types.ts`
- **.defaultJsonMerge()** (4 connections) — `packages/core/src/vfs/vfs.ts`
- **.getAllFiles()** (4 connections) — `packages/core/src/vfs/vfs.ts`
- **.getFile()** (4 connections) — `packages/core/src/vfs/vfs.ts`
- **.applyActions()** (3 connections) — `packages/core/src/vfs/vfs.ts`
- **.toTree()** (3 connections) — `packages/core/src/vfs/vfs.ts`
- **.deleteFile()** (2 connections) — `packages/core/src/vfs/vfs.ts`
- **.getFileContent()** (2 connections) — `packages/core/src/vfs/vfs.ts`
- **.hasFile()** (2 connections) — `packages/core/src/vfs/vfs.ts`
- **AppendFileAction** (1 connections) — `packages/core/src/vfs/types.ts`
- **CreateFileAction** (1 connections) — `packages/core/src/vfs/types.ts`
- **DeleteFileAction** (1 connections) — `packages/core/src/vfs/types.ts`
- **FileActionType** (1 connections) — `packages/core/src/vfs/types.ts`
- **MergeJsonAction** (1 connections) — `packages/core/src/vfs/types.ts`
- **OverwriteFileAction** (1 connections) — `packages/core/src/vfs/types.ts`
- **PatchAstAction** (1 connections) — `packages/core/src/vfs/types.ts`

## Relationships

- [Core Scaffolding Engine & Slices](Core_Scaffolding_Engine_&_Slices.md) (16 shared connections)
- [Desktop File Tree & Editor Drawer Preview](Desktop_File_Tree_&_Editor_Drawer_Preview.md) (2 shared connections)
- [ForgeStack CLI & Template Store](ForgeStack_CLI_&_Template_Store.md) (1 shared connections)

## Source Files

- `packages/core/src/vfs/types.ts`
- `packages/core/src/vfs/vfs.ts`

## Audit Trail

- EXTRACTED: 40 (98%)
- INFERRED: 1 (2%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*