import type { Job } from 'bullmq';

import path from 'node:path';
import { Transform } from '@json2csv/node';
import { format } from 'date-fns';

import fs from 'fs-extra';
import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';

import { addTime } from '@intake24/api/util';
import type { CategoryPortionSizeMethod, FoodPortionSizeMethod } from '@intake24/db';
import { Job as DbJob, Food, SystemLocale } from '@intake24/db';
import BaseJob from '../job';

export type ItemTransform = {
  food: Food;
  dat: {
    categories: string[];
    portionSizeMethods: (CategoryPortionSizeMethod | FoodPortionSizeMethod)[];
  };
};

export default class LocaleFoods extends BaseJob<'LocaleFoods'> {
  readonly name = 'LocaleFoods';

  private dbJob!: DbJob;

  private readonly fsConfig;

  private readonly cachedParentCategoriesService;
  private readonly portionSizeMethodsService;

  constructor({
    cachedParentCategoriesService,
    fsConfig,
    logger,
    portionSizeMethodsService,
  }: Pick<
    IoC,
    | 'cachedParentCategoriesService'
    | 'fsConfig'
    | 'logger'
    | 'portionSizeMethodsService'
  >) {
    super({ logger });

    this.fsConfig = fsConfig;
    this.cachedParentCategoriesService = cachedParentCategoriesService;
    this.portionSizeMethodsService = portionSizeMethodsService;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof LocaleFoods
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    const dbJob = await DbJob.findByPk(this.dbId);
    if (!dbJob)
      throw new NotFoundError(`Job ${this.name}: Job record not found (${this.dbId}).`);

    this.dbJob = dbJob;

    this.logger.debug('Job started.');

    await this.exportData();

    this.logger.debug('Job finished.');
  }

  private async prepareExportInfo() {
    const { localeId } = this.params;
    const locale = await SystemLocale.findByPk(localeId, { attributes: ['code'] });
    if (!locale)
      throw new NotFoundError(`Job ${this.name}: Locale not found (${localeId}).`);

    const { code: localeCode } = locale;

    const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
    const filename = `intake24-${this.name}-${localeCode}-${timestamp}.csv`;

    const total = await Food.count({ where: { localeId: localeCode } });

    const fields = [
      { label: 'Locale', value: 'localeId' },
      { label: 'Food code', value: 'code' },
      { label: 'English name', value: 'englishName' },
      { label: 'Local name', value: 'name' },
      { label: 'Alternative names', value: 'altNames' },
      { label: 'Tags', value: 'tags' },
      { label: 'Exclude tags', value: 'excludeTags' },
      { label: 'FCT', value: 'nutrientTableId' },
      { label: 'FCT record ID', value: 'nutrientTableRecordId' },
      { label: 'Associated Food / Category', value: 'associatedFoods' },
      { label: 'Brands', value: 'brands' },
      { label: 'Categories', value: 'categories' },
      { label: 'Portion Size methods', value: 'portionSizeMethods' },
    ];

    return { localeCode, filename, fields, total };
  }

  private async exportData(): Promise<void> {
    const { localeCode, fields, filename, total } = await this.prepareExportInfo();

    this.initProgress(total);

    let counter = 0;
    const progressInterval = setInterval(async () => {
      await this.setProgress(counter);
    }, 1000);

    return new Promise((resolve, reject) => {
      const filepath = path.resolve(this.fsConfig.local.downloads, filename);
      const output = fs.createWriteStream(filepath, { encoding: 'utf-8', flags: 'w+' });

      const foods = Food.findAllWithStream({
        where: { localeId: localeCode },
        include: [
          {
            association: 'associatedFoods',
            required: false,
            separate: true,
            where: { localeId: localeCode },
          },
          { association: 'brands' },
          { association: 'nutrientRecords' },
          {
            association: 'portionSizeMethods',
            separate: true,
          },
        ],
        order: [['code', 'asc']],
        transform: async (food: Food) => {
          const [categories, portionSizeMethods] = await Promise.all([
            this.cachedParentCategoriesService.getFoodAllCategories(food.id),
            food.portionSizeMethods?.length
              ? this.portionSizeMethodsService.resolvePortionSizeMethods(
                  food.localeId,
                  food.code,
                )
              : ([] as (CategoryPortionSizeMethod | FoodPortionSizeMethod)[]),
          ]);

          return { food, dat: { categories, portionSizeMethods } };
        },
      });

      const transform = new Transform(
        {
          fields,
          withBOM: true,
          transforms: [
            ({ food, dat }: ItemTransform) => {
              const {
                id,
                code,
                localeId,
                englishName,
                name,
                altNames,
                brands = [],
                associatedFoods = [],
                nutrientRecords = [],
                portionSizeMethods: foodPSMs = [],
                tags,
                excludeTags,
              } = food;
              const { categories, portionSizeMethods: datPSMs } = dat;

              return {
                id,
                code,
                localeId,
                englishName,
                name,
                altNames: Object.values(altNames).reduce<string[]>((acc, names) => {
                  acc.push(...names);
                  return acc;
                }, []).join(', '),
                tags: tags.join(', '),
                excludeTags: excludeTags.join(', '),
                nutrientTableId: nutrientRecords[0]?.nutrientTableId,
                nutrientTableRecordId: nutrientRecords[0]?.nutrientTableRecordId,
                associatedFoods: associatedFoods
                  .map(
                    ({ associatedFoodCode, associatedCategoryCode }) =>
                      associatedFoodCode ?? associatedCategoryCode,
                  )
                  .join(', '),
                categories: categories.join(', '),
                brands: brands.map(({ name }) => name).join(', '),
                portionSizeMethods: (foodPSMs.length ? foodPSMs : datPSMs)
                  .map(
                    ({ method, conversionFactor, parameters = [] }) =>
                      `Method: ${method}, conversion: ${conversionFactor}, ${JSON.stringify(parameters)}`,
                  )
                  .join('\n'),
              };
            },
          ],
        },
        {},
        { objectMode: true },
      );

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

          await this.dbJob.update({
            downloadUrl: filename,
            downloadUrlExpiresAt: addTime(this.fsConfig.urlExpiresAt),
          });

          resolve();
        });

      foods.pipe(transform).pipe(output);
    });
  }
}
