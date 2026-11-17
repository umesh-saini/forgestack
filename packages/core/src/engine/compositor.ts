import { VirtualFileSystem } from '../vfs/vfs.js';
import type { ProjectConfig } from '../types/config.js';

export interface FeatureSlice {
  id: string;
  name: string;
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => void | Promise<void>;
}

export class RecipeCompositor {
  private slices: FeatureSlice[] = [];

  public registerSlice(slice: FeatureSlice): this {
    this.slices.push(slice);
    return this;
  }

  public registerSlices(slices: FeatureSlice[]): this {
    for (const slice of slices) {
      this.registerSlice(slice);
    }
    return this;
  }

  /**
   * Executes registered slices in order onto a fresh VirtualFileSystem.
   */
  public async compose(config: ProjectConfig): Promise<VirtualFileSystem> {
    const vfs = new VirtualFileSystem();

    for (const slice of this.slices) {
      try {
        await slice.apply(vfs, config);
      } catch (err) {
        throw new Error(
          `Error executing slice '${slice.id}' (${slice.name}): ${(err as Error).message}`
        );
      }
    }

    return vfs;
  }
}
