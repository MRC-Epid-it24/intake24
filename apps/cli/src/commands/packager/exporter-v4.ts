import path from 'node:path';

import { uniqBy, zip } from 'lodash';
import { ApiClientV4 } from '@intake24/api-client-v4';
import typeConverters from '@intake24/cli/commands/packager/types/v4-type-conversions';
import logger from '@intake24/common-backend/services/logger/logger';
import { PkgConstants } from './constants';
import { PackageWriter } from './package-writer';
import { PkgGlobalFood, PkgLocalFood } from './types/foods';
import { PkgLocale } from './types/locale';

export type Logger = typeof logger;

export interface ExporterOptions {
  jsonSpaces: number;
  outputEncoding: BufferEncoding;
  maxConcurrentApiRequests: number;
}

const defaultOptions: ExporterOptions = {
  jsonSpaces: 2,
  outputEncoding: 'utf-8',
  maxConcurrentApiRequests: 1,
};

interface LocaleData {
  properties: PkgLocale;
  localFoods: PkgLocalFood[];
  enabledLocalFoods: string[];
  globalFoods: PkgGlobalFood[];
  // localCategories: PkgLocalCategory[];
  // globalCategories: PkgGlobalCategory[];
}

export class ExporterV4 {
  private readonly workingDir: string;
  private readonly apiClient: ApiClientV4;
  private readonly logger: Logger;
  private readonly options: ExporterOptions;

  private readonly imageDirPath: string;

  private localeIds = new Set<string>();

  constructor(
    apiClient: ApiClientV4,
    logger: Logger,
    workingDir: string,
    options?: Partial<ExporterOptions>,
  ) {
    this.apiClient = apiClient;
    this.logger = logger;
    this.workingDir = workingDir;
    this.imageDirPath = path.join(this.workingDir, PkgConstants.IMAGE_DIRECTORY_NAME);
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  private cleanUp() {
    this.localeIds = new Set<string>();
  }

  async addLocales(localeIds: string[]): Promise<void> {
    localeIds.forEach(id => this.localeIds.add(id));
  }

  private async getFoodData(localeId: string, foodCode: string) {
    const foodData = await this.apiClient.fdbs.getFoodByCode(localeId, foodCode);

    if (foodData === null)
      throw new Error(`Failed to fetch foods data for locale ${localeId}, food code ${foodCode} (Not Found)`);

    return foodData;
  }

  async getLocaleData(localeCode: string): Promise<LocaleData> {
    logger.info(`Fetching data for locale '${localeCode}'`);

    const properties = await this.apiClient.locales.findByCode(localeCode);

    if (properties === null)
      throw new Error(`Invalid locale code: ${localeCode} (Not Found)`);

    const enabledFoods = await this.apiClient.foods.getEnabledFoods(localeCode);

    if (enabledFoods === null)
      throw new Error(`Failed to fetch enabled foods for locale: ${localeCode} (Not Found)`);

    const sortedEnabledCodes = enabledFoods.enabledFoods.sort();

    const foodData = await Promise.all(
      sortedEnabledCodes
        .map(foodCode => this.getFoodData(properties.id, foodCode)),
    );

    const localFoods = foodData.map(food => typeConverters.packageLocalFood(food.foodCode, properties.respondentLanguageId, food));

    const globalFoods = foodData.map(food => typeConverters.packageGlobalFood(food.main!));

    return {
      properties: typeConverters.packageLocale(properties),
      localFoods,
      globalFoods,
      enabledLocalFoods: sortedEnabledCodes,
    };
  }

  public async export() {
    const sortedLocaleIds = [...this.localeIds].sort();

    const localeData = await Promise.all(sortedLocaleIds.map(id => this.getLocaleData(id)));

    const uniqueGlobalFoods = uniqBy(
      localeData.flatMap(data => data.globalFoods),
      globalFood => globalFood.code,
    );

    const writer = new PackageWriter(logger, this.workingDir, this.options);

    await Promise.all([
      writer.writeLocales(localeData.map(data => data.properties)),
      writer.writeLocalFoods(
        Object.fromEntries(
          zip(
            sortedLocaleIds,
            localeData.map(data => data.localFoods),
          ),
        ),
      ),
      writer.writeGlobalFoods(
        uniqueGlobalFoods,
      ),
      writer.writePackageInfo(),
    ]);

    this.cleanUp();
  }
}
