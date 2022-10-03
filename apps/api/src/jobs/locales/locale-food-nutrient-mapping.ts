import path from 'node:path';

import type { Job } from 'bullmq';
import { format } from 'date-fns';
import fs from 'fs-extra';
import { Transform } from 'json2csv';
import slugify from 'slugify';

import type { IoC } from '@intake24/api/ioc';
import { NotFoundError } from '@intake24/api/http/errors';
import { EMPTY } from '@intake24/api/services/admin/data-export';
import { addTime } from '@intake24/api/util';
import { FoodLocal, FoodsNutrientType, Job as DbJob, SystemLocale } from '@intake24/db';

import BaseJob from '../job';

export default class LocaleFoodNutrientMapping extends BaseJob<'LocaleFoodNutrientMapping'> {
  readonly name = 'LocaleFoodNutrientMapping';

  private dbJob!: DbJob;

  private readonly fsConfig;

  constructor({ fsConfig, logger }: Pick<IoC, 'fsConfig' | 'logger'>) {
    super({ logger });

    this.fsConfig = fsConfig;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof LocaleFoodNutrientMapping
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    const dbJob = await DbJob.findByPk(this.id);
    if (!dbJob) throw new NotFoundError(`Job ${this.name}: Job record not found (${this.id}).`);

    this.dbJob = dbJob;

    this.logger.debug('Job started.');

    await this.exportData();

    this.logger.debug('Job finished.');
  }

  private async prepareExportInfo() {
    const { localeId } = this.params;
    const locale = await SystemLocale.findByPk(localeId);
    if (!locale) throw new NotFoundError(`Job ${this.name}: Locale not found (${localeId}).`);

    const { code: localeCode } = locale;

    const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
    const filename = `${slugify(this.name)}-${localeCode}-${timestamp}.csv`;

    const [nutrients, total] = await Promise.all([
      FoodsNutrientType.findAll({ include: [{ association: 'unit' }], order: [['id', 'asc']] }),
      FoodLocal.count({
        where: { localeId: localeCode },
        include: [{ association: 'main' }],
      }),
    ]);

    const nutrientFields = nutrients.map((nutrient) => ({
      label: `${nutrient.description} (${nutrient.unit?.symbol ?? EMPTY})`,
      value: `nt-${nutrient.id}`,
    }));

    const foodFields = [
      { label: 'Food code', value: 'foodCode' },
      { label: 'English description', value: 'englishName' },
      { label: 'Local description', value: 'name' },
      { label: 'Source locale', value: 'localeId' },
      { label: 'FCT', value: 'nutrientTableId' },
      { label: 'FCT record ID', value: 'nutrientTableRecordId' },
    ];

    const fields = [...foodFields, ...nutrientFields];

    const transforms = [
      (item: FoodLocal) => {
        const {
          foodCode,
          name,
          localeId,
          main: { name: englishName } = {},
          nutrientRecords,
        } = item;

        if (!nutrientRecords?.length) return { foodCode, name, englishName, localeId };

        const { nutrientTableId, nutrientTableRecordId, nutrients = [] } = nutrientRecords[0];

        const nutrientData = nutrients.reduce<Record<string, number>>((acc, nutrient) => {
          acc[`nt-${nutrient.nutrientTypeId}`] = nutrient.unitsPer100g;
          return acc;
        }, {});

        return {
          foodCode,
          name,
          englishName,
          localeId,
          nutrientTableId,
          nutrientTableRecordId,
          ...nutrientData,
        };
      },
    ];

    return { localeCode, filename, fields, total, transforms };
  }

  /**
   *
   *
   * @private
   * @returns {Promise<void>}
   * @memberof LocaleFoodNutrientMapping
   */
  private async exportData(): Promise<void> {
    const { localeCode, fields, filename, total, transforms } = await this.prepareExportInfo();

    this.initProgress(total);

    let counter = 0;
    const progressInterval = setInterval(() => {
      this.setProgress(counter);
    }, 1500);

    return new Promise((resolve, reject) => {
      const filepath = path.resolve(this.fsConfig.local.downloads, filename);
      const output = fs.createWriteStream(filepath, { encoding: 'utf8', flags: 'w+' });

      const foods = FoodLocal.findAllWithStream({
        where: { localeId: localeCode },
        include: [
          { association: 'main' },
          { association: 'nutrientRecords', include: [{ association: 'nutrients' }] },
        ],
        order: [['foodCode', 'asc']],
      });

      const transform = new Transform<FoodLocal>({
        fields,
        defaultValue: EMPTY,
        withBOM: true,
        transforms,
      });

      foods.on('error', (err) => {
        clearInterval(progressInterval);
        reject(err);
      });

      transform
        .on('error', (err) => {
          clearInterval(progressInterval);
          reject(err);
        })
        .on('data', () => {
          counter++;
        })
        .on('end', async () => {
          clearInterval(progressInterval);

          const downloadUrlExpiresAt = addTime(this.fsConfig.urlExpiresAt);
          await this.dbJob.update({ downloadUrl: filename, downloadUrlExpiresAt });

          resolve();
        });

      foods.pipe(transform).pipe(output);
    });
  }
}
