import fs from 'fs-extra';
import type { IoC } from '@/ioc';

export default class Filesystem {
  config;

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
    Object.values(this.config.local).forEach((value) => fs.ensureDir(value));
  }
}
