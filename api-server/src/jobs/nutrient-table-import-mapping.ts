import { parse } from 'fast-csv';
import fs from 'fs-extra';
import path from 'path';
import type { NutrientTableImportMappingParams } from '@common/types';
import { JobsOptions } from 'bullmq';
import { excelColumnToOffset } from '@common/util';
import type { IoC } from '@/ioc';
import Job from './job';
import { NutrientTable, NutrientTableCsvMappingNutrient, NutrientType } from '@/db/models/foods';

export type CSVRow = {
  'Intake24 nutrient ID': string;
  'NDB spreadsheet column index': string;
};

const requiredFields = ['Intake24 nutrient ID', 'NDB spreadsheet column index'];

export default class NutrientTableImportMapping extends Job<NutrientTableImportMappingParams> {
  readonly name = 'NutrientTableImportMapping';

  private file!: string;

  private content: CSVRow[] = [];

  constructor({ logger }: Pick<IoC, 'logger'>) {
    super({ logger });
  }

  /**
   * Run the task
   *
   * @param {string} jobId
   * @param {NutrientTableImportMappingParams} params
   * @param {JobsOptions} ops
   * @returns {Promise<void>}
   * @memberof NutrientTableImportMapping
   */
  public async run(
    jobId: string,
    params: NutrientTableImportMappingParams,
    ops: JobsOptions
  ): Promise<void> {
    this.init(jobId, params, ops);

    this.file = path.resolve(params.file);

    this.logger.debug(`Job ${this.name} | ${jobId} started.`);

    const fileExists = await fs.pathExists(this.file);
    if (!fileExists) throw new Error(`Missing file (${this.file}).`);

    const nutrientTable = await NutrientTable.findByPk(params.nutrientTableId);
    if (!nutrientTable) throw new Error(`Nutrient table record not found.`);

    await this.validate();

    await this.import();

    this.logger.debug(`Job ${this.name} | ${jobId} finished.`);
  }

  /**
   * Read CSV file and validate in chunks
   *
   * @private
   * @param {number} [chunk=100]
   * @returns {Promise<void>}
   * @memberof NutrientTableImportMapping
   */
  private async validate(chunk = 100): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.file).pipe(parse({ headers: true, trim: true }));

      stream
        .on('data', (row: CSVRow) => {
          this.content.push(row);

          if (chunk > 0 && this.content.length === chunk) {
            stream.pause();
            this.validateChunk()
              .then(() => {
                if (stream.destroyed) resolve();
                else stream.resume();
              })
              .catch((err) => {
                stream.destroy(err);
                reject(err);
              });
          }
        })
        .on('end', (records: number) => {
          this.validateChunk()
            .then(() => resolve())
            .catch((err) => {
              stream.destroy(err);
              reject(err);
            });
        })
        .on('error', (err) => reject(err));
    });
  }

  /**
   * Chunk validator. It validates:
   * - presence of required fields
   * - username / survey alias uniqueness within survey
   * - email uniqueness within system
   *
   * @private
   * @returns {Promise<void>}
   * @memberof NutrientTableImportMapping
   */
  private async validateChunk(): Promise<void> {
    if (!this.content.length) return;

    const csvFields = Object.keys(this.content[0]);

    // Check for presence of required fields
    if (requiredFields.some((field) => !csvFields.includes(field)))
      throw new Error(`Missing some of the required fields (${requiredFields.join(',')}).`);

    const nutrientIds = this.content.map((item) => item['Intake24 nutrient ID']);
    const count = await NutrientType.count({ where: { id: nutrientIds } });

    if (nutrientIds.length !== count)
      throw new Error(`Spreadsheet contains some invalid nutrient IDs.`);

    this.content = [];
  }

  /**
   * Read CSV file and import in chunks
   *
   * @private
   * @param {number} [chunk=100]
   * @returns {Promise<void>}
   * @memberof NutrientTableImportMapping
   */
  private async import(chunk = 100): Promise<void> {
    const { nutrientTableId } = this.params;

    // Clean old data
    await NutrientTableCsvMappingNutrient.destroy({ where: { nutrientTableId } });

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.file).pipe(parse({ headers: true, trim: true }));

      stream
        .on('data', (row: CSVRow) => {
          this.content.push(row);

          if (chunk > 0 && this.content.length === chunk) {
            stream.pause();
            this.importChunk()
              .then(() => {
                if (stream.destroyed) resolve();
                else stream.resume();
              })
              .catch((err) => {
                stream.destroy(err);
                reject(err);
              });
          }
        })
        .on('end', (records: number) => {
          this.importChunk()
            .then(() => resolve())
            .catch((err) => {
              stream.destroy(err);
              reject(err);
            });
        })
        .on('error', (err) => reject(err));
    });
  }

  /**
   * Chunk importer
   *
   * @private
   * @returns {Promise<void>}
   * @memberof NutrientTableImportMapping
   */
  private async importChunk(): Promise<void> {
    if (!this.content.length) return;

    const { nutrientTableId } = this.params;

    const records = this.content.map((item) => {
      const {
        'Intake24 nutrient ID': nutrientTypeId,
        'NDB spreadsheet column index': columnOffset,
      } = item;

      return {
        nutrientTableId,
        nutrientTypeId,
        columnOffset: excelColumnToOffset(columnOffset),
      };
    });

    await NutrientTableCsvMappingNutrient.bulkCreate(records);

    this.content = [];
  }
}
