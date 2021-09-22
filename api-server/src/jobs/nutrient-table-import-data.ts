import { Job } from 'bullmq';
import { parse } from 'fast-csv';
import fs from 'fs-extra';
import path from 'path';
import type { NutrientTableImportDataParams } from '@common/types';
import type { IoC } from '@/ioc';
import StreamLockJob from './stream-lock-job';
import {
  NutrientTable,
  NutrientTableCsvMapping,
  NutrientTableCsvMappingField,
  NutrientTableCsvMappingNutrient,
  NutrientTableRecord,
  NutrientTableRecordField,
  NutrientTableRecordNutrient,
} from '@/db/models/foods';

export type CSVRow = string[];

export type Mappings = {
  mapping: NutrientTableCsvMapping;
  fields: NutrientTableCsvMappingField[];
  nutrients: NutrientTableCsvMappingNutrient[];
};

export default class NutrientTableImportData extends StreamLockJob<NutrientTableImportDataParams> {
  readonly name = 'NutrientTableImportData';

  private file!: string;

  private content: CSVRow[] = [];

  private mappings!: Mappings;

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

    const nutrientTable = await NutrientTable.findByPk(this.params.nutrientTableId, {
      include: [
        { model: NutrientTableCsvMapping, required: true },
        { model: NutrientTableCsvMappingField, separate: true },
        { model: NutrientTableCsvMappingNutrient, separate: true },
      ],
    });

    if (!nutrientTable || !nutrientTable.csvMapping)
      throw new Error(`Nutrient table record not found.`);

    this.mappings = {
      mapping: nutrientTable.csvMapping,
      fields: nutrientTable.csvMappingFields ?? [],
      nutrients: nutrientTable.csvMappingNutrients ?? [],
    };

    await this.validate();

    await this.import();

    this.logger.debug('Job finished.');
  }

  /**
   * Read CSV file and validate in chunks
   *
   * @private
   * @param {number} [chunk=500]
   * @returns {Promise<void>}
   * @memberof NutrientTableImportData
   */
  private async validate(chunk = 500): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.file).pipe(
        parse({
          headers: false,
          skipLines: this.mappings.mapping.rowOffset,
        })
      );

      const maxOffset = [
        ...this.mappings.fields.map(({ columnOffset }) => columnOffset),
        ...this.mappings.nutrients.map(({ columnOffset }) => columnOffset),
      ].reduce((acc, value) => (value > acc ? value : acc), 0);

      let checkColumnOffsets = false;

      stream
        .on('data', (row: CSVRow) => {
          if (!checkColumnOffsets) {
            checkColumnOffsets = true;

            if (row.length - 1 < maxOffset)
              throw new Error(
                `Insufficient column number (${row.length}) for the highest mapping offset is ${maxOffset}`
              );
          }
        })
        .on('end', (records: number) => {
          this.initProgress(records);
          resolve();
        })
        .on('error', (err) => reject(err));
    });
  }

  /**
   * Read CSV file and import in chunks
   *
   * @private
   * @param {number} [chunk=10]
   * @returns {Promise<void>}
   * @memberof NutrientTableImportData
   */
  private async import(chunk = 10): Promise<void> {
    const { nutrientTableId } = this.params;

    // Clean old data
    await NutrientTableRecord.destroy({ where: { nutrientTableId } });

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.file).pipe(
        parse({
          headers: false,
          trim: true,
          skipLines: this.mappings.mapping.rowOffset,
        })
      );

      stream
        .on('data', (row: CSVRow) => {
          this.content.push(row);

          if (chunk > 0 && this.content.length === chunk) {
            stream.pause();
            this.importChunk()
              .then(() => {
                stream.resume();
              })
              .catch((err) => {
                stream.destroy(err);
                reject(err);
              });
          }
        })
        .on('end', async () => {
          await this.waitForUnlock();

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
   * @memberof NutrientTableImportData
   */
  private async importChunk(): Promise<void> {
    if (!this.content.length) return;

    this.lock();

    const { nutrientTableId } = this.params;
    const {
      mapping: { idColumnOffset, descriptionColumnOffset, localDescriptionColumnOffset },
      nutrients,
      fields,
    } = this.mappings;

    for (const record of this.content) {
      const nutrientRecordInput = {
        nutrientTableId,
        nutrientTableRecordId: record[idColumnOffset],
        name: record[descriptionColumnOffset],
        localName: localDescriptionColumnOffset ? record[localDescriptionColumnOffset] : null,
      };

      const { id: nutrientTableRecordId } = await NutrientTableRecord.create(nutrientRecordInput);

      if (fields.length) {
        const fieldRecords = fields.map((field) => ({
          nutrientTableRecordId,
          name: field.fieldName,
          value: record[field.columnOffset],
        }));

        await NutrientTableRecordField.bulkCreate(fieldRecords);
      }

      if (nutrients.length) {
        const nutrientRecords = nutrients.map((nutrient) => {
          const units = parseFloat(record[nutrient.columnOffset]);

          return {
            nutrientTableRecordId,
            nutrientTypeId: nutrient.nutrientTypeId,
            unitsPer100g: Number.isNaN(units) ? 0 : units,
          };
        });

        await NutrientTableRecordNutrient.bulkCreate(nutrientRecords);
      }
    }

    await this.incrementProgress(this.content.length);

    this.content = [];

    this.unlock();
  }
}
