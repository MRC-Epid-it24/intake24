import { Job } from 'bullmq';
import fs from 'fs-extra';
import path from 'path';
import type { NutrientTableImportDataParams } from '@common/types';
import type { IoC } from '@/ioc';
import BaseJob from './job';
import { NutrientTable } from '@/db/models/foods';

export type CSVRow = {
  'Intake24 nutrient ID': string;
  'NDB spreadsheet column index': string;
};

// const requiredFields = ['username', 'password'];

export default class NutrientTableImportData extends BaseJob<NutrientTableImportDataParams> {
  readonly name = 'NutrientTableImportData';

  private file!: string;

  private content: CSVRow[] = [];

  constructor({ logger }: Pick<IoC, 'logger'>) {
    super({ logger });
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof NutrientTableImportData
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.file = path.resolve(this.params.file);

    this.logger.debug('Job started.');

    const fileExists = await fs.pathExists(this.file);
    if (!fileExists) throw new Error(`Missing file (${this.file}).`);

    const nutrientTable = await NutrientTable.findByPk(this.params.nutrientTableId);
    if (!nutrientTable) throw new Error(`Nutrient table record not found.`);

    this.logger.debug('Job finished.');
  }
}
