import fs from 'fs-extra';
import path from 'path';
import type { NutrientTableImportDataParams } from '@common/types';
import { JobsOptions } from 'bullmq';
import type { IoC } from '@/ioc';
import Job from './job';
import { NutrientTable } from '@/db/models/foods';

export type CSVRow = {
  'Intake24 nutrient ID': string;
  'NDB spreadsheet column index': string;
};

// const requiredFields = ['username', 'password'];

export default class NutrientTableImportData extends Job<NutrientTableImportDataParams> {
  readonly name = 'NutrientTableImportData';

  private file!: string;

  private content: CSVRow[] = [];

  constructor({ logger }: Pick<IoC, 'logger'>) {
    super({ logger });
  }

  /**
   * Run the task
   *
   * @param {string} jobId
   * @param {NutrientTableImportDataParams} params
   * @param {JobsOptions} ops
   * @returns {Promise<void>}
   * @memberof NutrientTableImportMapping
   */
  public async run(
    jobId: string,
    params: NutrientTableImportDataParams,
    ops: JobsOptions
  ): Promise<void> {
    this.init(jobId, params, ops);

    this.file = path.resolve(params.file);

    this.logger.debug(`Job ${this.name} | ${jobId} started.`);

    const fileExists = await fs.pathExists(this.file);
    if (!fileExists) throw new Error(`Missing file (${this.file}).`);

    const nutrientTable = await NutrientTable.findByPk(params.nutrientTableId);
    if (!nutrientTable) throw new Error(`Nutrient table record not found.`);

    this.logger.debug(`Job ${this.name} | ${jobId} finished.`);
  }
}
