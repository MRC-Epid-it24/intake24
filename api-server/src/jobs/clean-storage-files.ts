import fs from 'fs-extra';
import path from 'path';
import type { IoC } from '@/ioc';
import { addTime } from '@/util';
import { LocalLocation } from '@/config/filesystem';
import type { Job, JobType } from '.';

export default class CleanStorageFiles implements Job {
  public readonly name: JobType = 'CleanStorageFiles';

  private readonly fsConfig;

  private readonly logger;

  constructor({ fsConfig, logger }: Pick<IoC, 'fsConfig' | 'logger'>) {
    this.fsConfig = fsConfig;
    this.logger = logger;
  }

  /**
   * Run the task
   *
   * @return Promise<void>
   */
  public async run(): Promise<void> {
    this.logger.debug(`Job ${this.name} started.`);

    const dirs: LocalLocation[] = ['downloads', 'uploads'];

    for (const dir of dirs) {
      await this.cleanDir(this.fsConfig.local[dir]);
    }

    this.logger.debug(`Job ${this.name} finished.`);
  }

  /**
   * Clean selected directory
   *
   * @private
   * @param {string} dir
   * @param {string} [expiresIn='1h']
   * @returns {Promise<void>}
   * @memberof CleanStorageFiles
   */
  private async cleanDir(dir: string, expiresIn = '1h'): Promise<void> {
    this.logger.debug(`Job ${this.name}: cleaning of '${dir}' folder started.`);

    const files = await fs.readdir(path.resolve(dir));
    const now = new Date();

    for (const file of files) {
      const filepath = path.resolve(dir, file);
      const { ctime } = await fs.stat(filepath);
      const expiresAt = addTime(expiresIn, ctime);

      if (expiresAt > now) continue;

      await fs.unlink(filepath);
    }

    this.logger.debug(`Job ${this.name}: cleaning of '${dir}' folder finished.`);
  }
}
