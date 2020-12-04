import fs from 'fs-extra';
import config, { FileSystemConfig } from '@/config/filesystem';

class Filesystem {
  config: FileSystemConfig;

  constructor(config: FileSystemConfig) {
    this.config = config;
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

export default new Filesystem(config);
