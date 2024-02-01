import type { Job } from 'bullmq';
import { randomUUID } from 'crypto';

import type { IoC } from '@intake24/api/ioc';
import type { NutrientTableRecordField, NutrientTableRecordNutrient } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import {
  Job as DbJob,
  NutrientTableRecord,
  Op,
  SurveySubmissionField,
  SurveySubmissionFood,
  SurveySubmissionNutrient,
} from '@intake24/db';

import BaseJob from '../job';

export default class SurveyNutrientsRecalculation extends BaseJob<'SurveyNutrientsRecalculation'> {
  readonly name = 'SurveyNutrientsRecalculation';

  private dbJob!: DbJob;

  private readonly db;

  constructor({ db, logger }: Pick<IoC, 'db' | 'logger'>) {
    super({ logger });

    this.db = db;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveyNutrientsRecalculation
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    const dbJob = await DbJob.findByPk(this.dbId);
    if (!dbJob) throw new NotFoundError(`Job ${this.name}: Job record not found (${this.dbId}).`);

    this.dbJob = dbJob;

    this.logger.debug('Job started.');

    await this.recalculate();

    this.logger.debug('Job finished.');
  }

  private async recalculate(batchSize = 100) {
    const { surveyId } = this.params;

    const total = await SurveySubmissionFood.count({
      include: {
        association: 'meal',
        required: true,
        include: [{ association: 'submission', where: { surveyId }, required: true }],
      },
    });

    this.initProgress(total);

    const offsets = [];
    let start = 0;

    while (start < total) {
      offsets.push(start);
      start += batchSize;
    }

    for (const offset of offsets) {
      const difference = batchSize + offset - total;
      const limit = difference > 0 ? batchSize - difference : batchSize;
      const foods = await SurveySubmissionFood.findAll({
        attributes: ['id', 'nutrientTableId', 'nutrientTableCode'],
        include: [
          {
            association: 'meal',
            attributes: ['id'],
            required: true,
            include: [
              {
                association: 'submission',
                attributes: ['id'],
                required: true,
                where: { surveyId },
              },
            ],
          },
          {
            association: 'portionSizes',
            where: { name: ['servingWeight', 'leftoversWeight'] },
            required: false,
            separate: true,
          },
        ],
        order: [
          ['meal', 'submission', 'submissionTime', 'ASC'],
          ['meal', 'submission', 'id', 'ASC'],
          ['meal', 'hours', 'ASC'],
          ['meal', 'minutes', 'ASC'],
          ['index', 'ASC'],
        ],
        offset,
        limit,
      });

      const foodIds: string[] = [];
      const nutrientTableRecordIds: Record<string, string[]> = {};
      const portionWeight: number[] = [];

      foods.forEach(({ id, nutrientTableId, nutrientTableCode, portionSizes = [] }) => {
        foodIds.push(id);
        if (!nutrientTableRecordIds[nutrientTableId]) nutrientTableRecordIds[nutrientTableId] = [];

        nutrientTableRecordIds[nutrientTableId].push(nutrientTableCode);
        const [first, second] = portionSizes;
        portionWeight.push(Math.abs(Number(first?.value ?? '0') - Number(second?.value ?? '0')));
      });

      const conditions = Object.entries(nutrientTableRecordIds).map(
        ([nutrientTableId, nutrientTableRecordId]) => ({ nutrientTableId, nutrientTableRecordId })
      );

      const nutrientRecords = await NutrientTableRecord.findAll({
        attributes: ['nutrientTableId', 'nutrientTableRecordId'],
        include: [{ association: 'fields' }, { association: 'nutrients' }],
        where: conditions.length > 1 ? { [Op.or]: conditions } : conditions[0],
      });

      const nutrientRecordMap = nutrientRecords.reduce<
        Record<
          string,
          { fields: NutrientTableRecordField[]; nutrients: NutrientTableRecordNutrient[] }
        >
      >((acc, item) => {
        acc[`${item.nutrientTableId}:${item.nutrientTableRecordId}`] = {
          fields: item.fields ?? [],
          nutrients: item.nutrients ?? [],
        };
        return acc;
      }, {});

      for (const [index, food] of Object.entries(foods)) {
        const { id: foodId, nutrientTableId, nutrientTableCode } = food;

        // Skip if nutrient table is not defined (e.g. recipe builder template)
        if (!nutrientTableId || !nutrientTableCode) continue;

        const key = `${nutrientTableId}:${nutrientTableCode}`;

        const match = nutrientRecordMap[key];
        if (!match) {
          this.logger.warn(`Nutrient record mapping not found.`, {
            nutrientTableId,
            nutrientTableCode,
          });
          continue;
        }

        const fields = match.fields.map(({ name, value }) => ({
          id: randomUUID(),
          foodId,
          fieldName: name,
          value,
        }));

        const nutrients = match.nutrients.map(({ nutrientTypeId, unitsPer100g }) => ({
          id: randomUUID(),
          foodId,
          nutrientTypeId,
          amount: (unitsPer100g * portionWeight[Number(index)]) / 100.0,
        }));

        await this.db.system.transaction(async (transaction) => {
          await Promise.all([
            SurveySubmissionField.destroy({ where: { foodId }, transaction }),
            SurveySubmissionNutrient.destroy({ where: { foodId }, transaction }),
          ]);

          await Promise.all(
            [
              fields.length ? SurveySubmissionField.bulkCreate(fields, { transaction }) : null,
              nutrients.length
                ? SurveySubmissionNutrient.bulkCreate(nutrients, { transaction })
                : null,
            ].filter(Boolean)
          );
        });
      }

      await this.incrementProgress(batchSize);
    }
  }
}
