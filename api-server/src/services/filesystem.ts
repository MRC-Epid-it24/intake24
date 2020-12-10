import fs from 'fs-extra';
import type { IoC } from '@/ioc';

export default class Filesystem {
  private readonly config;

  constructor({ config }: IoC) {
    this.config = config.filesystem;
  }

  /**
   * Initialize filesystem
   *
   * @returns {Promise<void>}
   * @memberof Filesystem
   */
  public async init(): Promise<void> {
    for (const dir of Object.values(this.config.local)) {
      await fs.ensureDir(dir);
    }
  }
}
