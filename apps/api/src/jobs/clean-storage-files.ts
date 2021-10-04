import { Job } from 'bullmq';
import fs from 'fs-extra';
import path from 'path';
import { CleanStorageFilesParams } from '@common/types';
import type { IoC } from '@api/ioc';
import { addTime } from '@api/util';
import { LocalLocation } from '@api/config/filesystem';
import BaseJob from './job';

export default class CleanStorageFiles extends BaseJob<CleanStorageFilesParams> {
  readonly name = 'CleanStorageFiles';

  private readonly config;

  constructor({ fsConfig, logger }: Pick<IoC, 'fsConfig' | 'logger'>) {
    super({ logger });

    this.config = fsConfig;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof CleanStorageFiles
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    const dirs: LocalLocation[] = ['downloads', 'uploads'];

    for (const dir of dirs) {
      await this.cleanDir(this.config.local[dir]);
    }

    this.logger.debug('Job finished.');
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
    this.logger.debug(`Cleaning of '${dir}' folder started.`);

    const files = await fs.readdir(path.resolve(dir));
    const now = new Date();

    for (const file of files) {
      const filepath = path.resolve(dir, file);
      const { ctime } = await fs.stat(filepath);
      const expiresAt = addTime(expiresIn, ctime);

      if (expiresAt > now) continue;

      await fs.unlink(filepath);
    }

    this.logger.debug(`Cleaning of '${dir}' folder finished.`);
  }
}
