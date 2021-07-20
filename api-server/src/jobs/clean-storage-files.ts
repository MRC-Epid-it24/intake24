import { JobsOptions } from 'bullmq';
import fs from 'fs-extra';
import path from 'path';
import type { IoC } from '@/ioc';
import { addTime } from '@/util';
import { LocalLocation } from '@/config/filesystem';
import { CleanStorageFilesParams } from '@common/types';
import Job from './job';

export default class CleanStorageFiles extends Job<CleanStorageFilesParams> {
  readonly name = 'CleanStorageFiles';

  private readonly config;

  constructor({ fsConfig, logger }: Pick<IoC, 'fsConfig' | 'logger'>) {
    super({ logger });

    this.config = fsConfig;
  }

  /**
   * Run the task
   *
   * @param {string} jobId
   * @param {CleanStorageFilesParams} params
   * @param {JobsOptions} ops
   * @returns {Promise<void>}
   * @memberof CleanStorageFiles
   */
  public async run(
    jobId: string,
    params: CleanStorageFilesParams,
    ops: JobsOptions
  ): Promise<void> {
    this.init(jobId, params, ops);

    this.logger.debug(`Job ${this.name} | ${jobId} started.`);

    const dirs: LocalLocation[] = ['downloads', 'uploads'];

    for (const dir of dirs) {
      await this.cleanDir(this.config.local[dir]);
    }

    this.logger.debug(`Job ${this.name} | ${jobId} finished.`);
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
