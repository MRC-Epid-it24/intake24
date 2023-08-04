import path from 'node:path';

import type { Job } from 'bullmq';
import { Transform } from '@json2csv/node';
import { format } from 'date-fns';
import fs from 'fs-extra';
import slugify from 'slugify';

import type { IoC } from '@intake24/api/ioc';
import { NotFoundError } from '@intake24/api/http/errors';
import { addTime } from '@intake24/api/util';
import { FoodLocal, Job as DbJob, SystemLocale } from '@intake24/db';

import BaseJob from '../job';

export default class LocaleFoods extends BaseJob<'LocaleFoods'> {
  readonly name = 'LocaleFoods';

  private dbJob!: DbJob;

  private readonly fsConfig;

  private readonly portionSizeMethodsService;

  constructor({
    fsConfig,
    logger,
    portionSizeMethodsService,
  }: Pick<IoC, 'fsConfig' | 'logger' | 'portionSizeMethodsService'>) {
    super({ logger });

    this.fsConfig = fsConfig;
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
    if (!dbJob) throw new NotFoundError(`Job ${this.name}: Job record not found (${this.dbId}).`);

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

    const total = await FoodLocal.count({
      where: { localeId: localeCode },
      include: [{ association: 'main' }],
    });

    const fields = [
      { label: 'Locale', value: 'localeId' },
      { label: 'Food code', value: 'foodCode' },
      { label: 'English name', value: 'englishName' },
      { label: 'Local name', value: 'name' },
      { label: 'FCT', value: 'nutrientTableId' },
      { label: 'FCT record ID', value: 'nutrientTableRecordId' },
      { label: 'Ready Meal', value: 'readyMealOption' },
      { label: 'Same As Before', value: 'sameAsBeforeOption' },
      { label: 'Reasonable Amount', value: 'reasonableAmount' },
      { label: 'Use In Recipes', value: 'useInRecipes' },
      { label: 'Associated Food / Category', value: 'associatedFoods' },
      { label: 'Brands', value: 'brands' },
      { label: 'Portion Size methods', value: 'portionSizeMethods' },
    ];

    const transforms = [
      (item: FoodLocal) => {
        const {
          foodCode,
          name,
          localeId,
          main: { name: englishName, attributes, brands = [] } = {},
          associatedFoods = [],
          nutrientRecords: [{ nutrientTableId, nutrientTableRecordId }] = [],
          portionSizeMethods = [],
        } = item;

        return {
          localeId,
          foodCode,
          name,
          englishName,
          nutrientTableId,
          nutrientTableRecordId,
          readyMealOption: attributes?.readyMealOption ?? 'Inherited',
          sameAsBeforeOption: attributes?.sameAsBeforeOption ?? 'Inherited',
          reasonableAmount: attributes?.reasonableAmount ?? 'Inherited',
          useInRecipes: attributes?.useInRecipes
            ? ['Anywhere', 'RegularFoodsOnly', 'RecipesOnly'][attributes.useInRecipes]
            : 'Inherited',
          brands: brands.map(({ name }) => name).join(', '),
          associatedFoods: associatedFoods
            .map(
              ({ associatedFoodCode, associatedCategoryCode }) =>
                associatedFoodCode ?? associatedCategoryCode
            )
            .join(', '),
          portionSizeMethods: portionSizeMethods
            .map(
              ({ method, conversionFactor, parameters = [] }) =>
                `Method: ${method}, conversion: ${conversionFactor}, ${parameters
                  .map(({ name, value }) => `${name}: ${value}`)
                  .join(', ')}`
            )
            .join('\n'),
        };
      },
    ];

    return { localeCode, filename, fields, total, transforms };
  }

  private async exportData(): Promise<void> {
    const { localeCode, fields, filename, total, transforms } = await this.prepareExportInfo();

    this.initProgress(total);

    let counter = 0;
    const progressInterval = setInterval(() => {
      this.setProgress(counter);
    }, 1000);

    return new Promise((resolve, reject) => {
      const filepath = path.resolve(this.fsConfig.local.downloads, filename);
      const output = fs.createWriteStream(filepath, { encoding: 'utf8', flags: 'w+' });

      const foods = FoodLocal.findAllWithStream({
        where: { localeId: localeCode },
        include: [
          {
            association: 'associatedFoods',
            required: false,
            separate: true,
            where: { localeId: localeCode },
          },
          {
            association: 'main',
            include: [{ association: 'attributes' }, { association: 'brands' }],
          },
          { association: 'nutrientRecords' },
          {
            association: 'portionSizeMethods',
            include: [{ association: 'parameters' }],
            separate: true,
          },
        ],
        order: [['foodCode', 'asc']],
      });

      const transform = new Transform<FoodLocal>(
        { fields, withBOM: true, transforms },
        { objectMode: true }
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
