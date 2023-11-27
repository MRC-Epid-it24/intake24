import os from 'node:os';

import decompress from 'decompress';
import fs from 'fs/promises';
import { omit } from 'lodash';
import path from 'path';

import type { ApiClientV4 } from '@intake24/api-client-v4';
import type { PkgGlobalFood, PkgLocalFood } from '@intake24/cli/commands/packager/types/foods';
import type { PkgImageMap } from '@intake24/cli/commands/packager/types/image-map';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import type { PkgNutrientTable } from '@intake24/cli/commands/packager/types/nutrient-tables';
import { PkgConstants } from '@intake24/cli/commands/packager/constants';
import logger from '@intake24/common-backend/services/logger/logger';

import typeConverters from './types/v4-type-conversions';

export type Logger = typeof logger;

export const conflictResolutionOptions = ['skip', 'overwrite', 'abort'] as const;

export type ConflictResolutionStrategy = (typeof conflictResolutionOptions)[number];

export interface ImporterOptions {
  onConflict?: ConflictResolutionStrategy;
}

const defaultOptions: ImporterOptions = {
  onConflict: 'abort',
};

export class ImporterV4 {
  private readonly inputFilePath: string;

  private readonly apiClient: ApiClientV4;
  private readonly logger: Logger;
  private readonly options: ImporterOptions;

  private packageDirPath: string | undefined;
  private imageDirPath: string | undefined;

  private compressedPackage: boolean = false;

  private locales: PkgLocale[] | undefined;
  private globalFoods: PkgGlobalFood[] | undefined;
  private localFoods: Record<string, PkgLocalFood[]> | undefined;
  private enabledLocalFoods: Record<string, string[]> | undefined;
  private nutrientTables: PkgNutrientTable[] | undefined;
  private imageMaps: Record<string, PkgImageMap> | undefined;

  constructor(
    apiClient: ApiClientV4,
    logger: Logger,
    inputFilePath: string,
    options?: Partial<ImporterOptions>
  ) {
    this.apiClient = apiClient;
    this.logger = logger;
    this.inputFilePath = inputFilePath;
    this.options = {
      onConflict: options?.onConflict ?? defaultOptions.onConflict,
    };
  }

  private async importImageMap(imageMapId: string, imageMap: PkgImageMap): Promise<void> {
    const existing = await this.apiClient.imageMaps.get(imageMapId);

    if (existing !== null) {
      switch (this.options.onConflict) {
        case 'skip':
          logger.info(`Image map already exists, skipping: ${imageMapId}`);
          return Promise.resolve();
        case 'abort': {
          const message = `Image map already exists: ${imageMapId}`;
          logger.error(message);
          return Promise.reject(new Error(message));
        }
        case 'overwrite': {
          logger.info(`Updating existing image map: ${imageMapId}`);
          const objects = typeConverters.fromPackageImageMapObjects(imageMap.objects);

          await this.apiClient.imageMaps.update(imageMapId, imageMap.description, objects);

          await this.apiClient.imageMaps.updateImage(
            imageMapId,
            path.join(this.imageDirPath!, imageMap.baseImagePath)
          );

          break;
        }
      }
    } else {
      logger.info(`Creating new image map: ${imageMapId}`);
      const objects = typeConverters.fromPackageImageMapObjects(imageMap.objects);

      await this.apiClient.imageMaps.create(
        imageMapId,
        imageMap.description,
        path.join(this.imageDirPath!, imageMap.baseImagePath),
        objects
      );
    }
  }

  private async importImageMaps(): Promise<void> {
    if (this.imageMaps !== undefined) {
      logger.info(`Importing ${Object.keys(this.imageMaps).length} image map(s)`);

      /*
      const [imageMapId, imageMap] = Object.entries(this.imageMaps)[0];

      await this.importImageMap(imageMapId, imageMap);

      const createOps = Object.entries(imageMaps).map(([imageMapId, imageMap]) =>
        this.apiClient.imageMaps.create()),
        })
      );

      await Promise.all(createOps);*/
    }
  }

  private async importLocale(locale: PkgLocale): Promise<void> {
    const localeEntry = typeConverters.fromPackageLocale(locale);
    const localeId = locale.id;

    const result = await this.apiClient.locales.create(localeId, localeEntry);

    if (result.type === 'conflict') {
      switch (this.options.onConflict) {
        case 'skip':
          logger.info(`Skipping locale "${localeId}" due to a conflict`);
          return;
        case 'abort': {
          const message = `Failed to import locale "${localeId}" due to a conflict`;
          logger.error(message);
          logger.error(JSON.stringify(result.details, null, 2));
          throw new Error(message);
        }
        case 'overwrite': {
          const existing = await this.apiClient.locales.findByCode(localeId);

          if (existing === null)
            throw new Error(`Failed to fetch existing locale data: ${localeId}`);

          await this.apiClient.locales.update(existing.id, localeEntry);
        }
      }
    }
  }

  private async importLocales(): Promise<void> {
    if (this.locales !== undefined) {
      logger.info(`Importing locale records`);
      const ops = this.locales.map((locale) => this.importLocale(locale));
      await Promise.all(ops);
      logger.info(`Finished importing locales`);
    }
  }

  private async importGlobalFood(food: PkgGlobalFood): Promise<void> {
    const foodEntry = typeConverters.fromPackageGlobalFood(food);

    const result = await this.apiClient.foods.createGlobalFood(foodEntry);

    if (result.type === 'conflict') {
      switch (this.options.onConflict) {
        case 'skip':
          logger.info(`Skipping food "${food.code}" due to a conflict`);
          return;
        case 'abort': {
          const message = `Failed to import food "${food.code}" due to a conflict`;
          logger.error(message);
          logger.error(JSON.stringify(result.details, null, 2));
          throw new Error(message);
        }
        case 'overwrite': {
          // This looks terribly inefficient, maybe give create an on conflict option instead?
          const existing = await this.apiClient.foods.findGlobalFood(food.code);

          if (existing !== null) {
            await this.apiClient.foods.updateGlobalFood(
              food.code,
              existing.version,
              omit(foodEntry, 'code')
            );
          }
        }
      }
    }
  }

  private async importGlobalFoods(): Promise<void> {
    if (this.globalFoods !== undefined) {
      const globalFoodsCount = this.globalFoods.length;

      logger.info(`Importing ${globalFoodsCount} global food record(s)`);

      const batchSize = 50;
      let importedCount = 0;

      for (let i = 0; i < globalFoodsCount; i += batchSize) {
        const batch = this.globalFoods.slice(i, i + batchSize);
        const ops = batch.map((food) => this.importGlobalFood(food));

        await Promise.all(ops);

        importedCount += batch.length;
        logger.info(`${importedCount}/${globalFoodsCount}...`);
      }

      logger.info('Finished importing global food records');
    }
  }

  private async importLocalFood(localeId: string, food: PkgLocalFood): Promise<void> {
    const createRequest = typeConverters.fromPackageLocalFood(food);

    if (this.options.onConflict === 'skip' || this.options.onConflict === 'abort') {
      const result = await this.apiClient.foods.createLocalFood(localeId, createRequest, {
        update: false,
        return: false,
      });

      if (result.type === 'conflict') {
        if (this.options.onConflict === 'skip') {
          logger.info(`Skipping local food "${food.code}" due to a conflict`);
        } else {
          const message = `Failed to import local food "${food.code}" due to a conflict`;
          logger.error(message);
          logger.error(JSON.stringify(result.details, null, 2));
          throw new Error(message);
        }
      }
    } else {
      const result = await this.apiClient.foods.createLocalFood(localeId, createRequest, {
        update: true,
        return: false,
      });

      if (result.type === 'conflict') {
        const message = `Failed to import local food "${food.code}" due to a conflict`;
        logger.error(message);
        logger.error(JSON.stringify(result.details, null, 2));
        throw new Error(message);
      }
    }
  }

  private async importLocalFoods(): Promise<void> {
    if (this.localFoods !== undefined) {
      logger.info(`Importing local food records`);

      for (const [localeId, localFoods] of Object.entries(this.localFoods)) {
        const localFoodsCount = localFoods.length;

        logger.info(`Importing ${localFoodsCount} local food record(s) for locale ${localeId}`);

        const batchSize = 50;
        let importedCount = 0;

        for (let i = 0; i < localFoodsCount; i += batchSize) {
          const batch = localFoods.slice(i, i + batchSize);
          const ops = batch.map((food) => this.importLocalFood(localeId, food));
          await Promise.all(ops);
          importedCount += batch.length;
          logger.info(`${importedCount}/${localFoodsCount}...`);
        }
      }

      logger.info('Finished importing local food records');
    }
  }

  private async importEnabledLocalFoods(): Promise<void> {
    if (this.enabledLocalFoods !== undefined) {
      for (const [localeId, enabledFoods] of Object.entries(this.enabledLocalFoods)) {
        logger.info(`Updating enabled food codes for locale ${localeId}`);

        await this.apiClient.foods.updateEnabledFoods(localeId, enabledFoods);
      }
    }
  }

  private async importNutrientTables(): Promise<void> {
    if (this.nutrientTables !== undefined) {
      for (const nutrientTable of this.nutrientTables) {
        logger.info(`Importing nutrient table ${nutrientTable.id}`);

        const record = typeConverters.fromPackageNutrientTable(nutrientTable);
        const existing = await this.apiClient.nutrientTables.get(nutrientTable.id);

        if (existing === null) {
          await this.apiClient.nutrientTables.create(record);
        } else {
          switch (this.options.onConflict) {
            case 'skip':
              logger.info(`Skipping nutrient table "${nutrientTable.id}" due to a conflict`);
              continue;
            case 'abort':
              throw new Error(
                `Failed to import nutrient table ${nutrientTable.id} due to a conflict`
              );
            case 'overwrite':
              await this.apiClient.nutrientTables.update(nutrientTable.id, record);
          }
        }

        const nutrientRecords = typeConverters.fromPackageNutrientTableRecords(nutrientTable);
        logger.info(
          `Updating ${nutrientRecords.length} nutrient record(s) in table ${nutrientTable.id}`
        );
        await this.apiClient.nutrientTables.updateRecords(nutrientTable.id, nutrientRecords);
      }
    }
  }

  private async readJSON<T>(relativePath: string): Promise<T | undefined> {
    const filePath = path.join(this.packageDirPath!, relativePath);
    logger.debug(`Reading JSON file: ${filePath}`);

    try {
      await fs.access(filePath);
    } catch (e) {
      logger.debug(`File ${filePath} does not exist or is not accessible, skipping`);
      return undefined;
    }

    return JSON.parse(await fs.readFile(filePath, 'utf-8')) as T;
  }

  private async readLocales(): Promise<void> {
    logger.debug('Loading locales');
    this.locales = await this.readJSON(PkgConstants.LOCALES_FILE_NAME);
  }

  private async readGlobalFoods(): Promise<void> {
    logger.debug('Loading global foods');
    this.globalFoods = await this.readJSON(PkgConstants.GLOBAL_FOODS_FILE_NAME);
  }

  private async readLocalFoods(): Promise<void> {
    logger.debug('Loading local foods');
    this.localFoods = await this.readJSON(PkgConstants.LOCAL_FOODS_FILE_NAME);
  }

  private async readEnabledLocalFoods(): Promise<void> {
    logger.debug('Loading enabled local foods');
    this.enabledLocalFoods = await this.readJSON(PkgConstants.ENABLED_LOCAL_FOODS_FILE_NAME);
  }

  private async readNutrientTables(): Promise<void> {
    logger.debug('Loading nutrient tables');
    this.nutrientTables = await this.readJSON(PkgConstants.NUTRIENT_TABLES_FILE_NAME);
  }

  private async readImageMaps(): Promise<void> {
    logger.debug('Loading image maps');
    this.imageMaps = await this.readJSON(
      path.join(PkgConstants.PORTION_SIZE_DIRECTORY_NAME, PkgConstants.IMAGE_MAP_FILE_NAME)
    );
  }

  public async readPackage(): Promise<void> {
    await Promise.all([
      this.readLocales(),
      this.readGlobalFoods(),
      this.readLocalFoods(),
      this.readEnabledLocalFoods(),
      this.readNutrientTables(),
      this.readImageMaps(),
    ]);
  }

  public async cleanUpPackage(): Promise<void> {
    if (this.compressedPackage) {
      logger.info(`Cleaning up temporary files`);
      await fs.rm(this.packageDirPath!, { recursive: true });
    }
  }

  public async unzipPackage(): Promise<void> {
    const stat = await fs.stat(this.inputFilePath);

    if (stat.isDirectory()) {
      this.packageDirPath = this.inputFilePath;
    } else {
      this.packageDirPath = await fs.mkdtemp(path.join(os.tmpdir(), 'i24pkg-'));
      this.compressedPackage = true;
      logger.info(`Extracting package: ${this.inputFilePath}`);
      logger.debug(`Temporary package directory: ${this.packageDirPath}`);
      await decompress(this.inputFilePath, this.packageDirPath);
    }

    this.imageDirPath = path.join(this.packageDirPath, PkgConstants.IMAGE_DIRECTORY_NAME);
  }

  public async import(): Promise<void> {
    await this.unzipPackage();
    await this.readPackage();
    await this.cleanUpPackage();
    await this.importLocales();
    await this.importNutrientTables();
    await this.importGlobalFoods();
    await this.importLocalFoods();
    await this.importEnabledLocalFoods();

    logger.info('Done!');

    // await this.importImageMaps();
  }
}
