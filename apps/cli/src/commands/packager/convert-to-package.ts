import type {
  CsvFoodRecordUnprocessed,
  CsvResultStructure,
  DefaultPSMCategory,
} from './types/csv-import';
import type {
  PkgAssociatedFood,
  PkgGlobalFood,
  PkgLocalFood,
  PkgPortionSizeMethod,
  PkgStandardUnit,
} from './types/foods';
import { randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';

import fs from 'node:fs/promises';

import path from 'node:path';
import csv from 'csv-parser';
import { ApiClientV4 } from '@intake24/api-client-v4';

import { CategoryContents, CategoryHeader } from '@intake24/common/types/http';
import type logger from '@intake24/common-backend/services/logger/logger';
import { PkgConstants } from './constants';
import { PkgLocalCategory } from './types/categories';
import { CsvFoodRecords } from './types/csv-import';
import { PkgLocale } from './types/locale';

interface CategoryCache {
  contents: Map<string, CategoryContents>;
  lookup: Map<string, 'category' | 'food' | 'unknown'>;
}

interface CategoryHierarchyCache {
  hierarchyMap: Map<string, string[]>;
  parentChildMap: Map<string, Set<string>>;
  processedCategories: Set<string>;
}

export type Logger = typeof logger;

export const convertorTypeOptions = ['package', 'csv'] as const;

export interface ConvertorOptions {
  type: 'package' | 'csv';
}

export interface existingCategories {
  code: string;
}

const defaultOptions: ConvertorOptions = {
  type: 'csv',
};

const DEFAULT_FOOD_COMPOSITION_TABLE = process.env.CSV_DEFAULT_FOOD_COMPOSION_TABLE || 'AUSNUT';
const DEFAULT_FOOD_COMPOSITION_TABLE_CODE
  = process.env.CSV_DEFAULT_FOOD_COMPOSITION_CODE || '01B10311';
const DEFAULT_SKIP_MISSING_CATEGORIES
  = process.env.DEFAULT_SKIP_MISSING_CATEGORIES === 'true' || false;

const allThePsmInTheImportCSV = new Set<string>([]);

export const csvHeaders = Object.values(CsvFoodRecords).map(record => record.header);

export class ConvertorToPackage {
  private readonly inputFilePath: string;
  private inputDirPath: string | undefined;
  private readonly outputFilePath: string;
  private readonly logger: Logger;
  private readonly options: ConvertorOptions;
  private csvStructure: typeof CsvFoodRecords | undefined;
  private existingCategories: string[] | undefined;

  private locales: PkgLocale[] | undefined = [];
  private categoryPsm: DefaultPSMCategory[] | undefined;
  private localeId: string | null = null;
  private globalFoodList: PkgGlobalFood[] = [];
  private localFoodList: PkgLocalFood[] = [];
  private enabledLocalesFoodList: string[] = [];
  private localCategories: PkgLocalCategory[] = [];
  private skipMissingCategories: boolean;
  private categoryCache: CategoryCache = {
    contents: new Map(),
    lookup: new Map(),
  };

  private psmCache = new Map<string, PkgPortionSizeMethod[]>();
  private keyValuePairCache = new Map<string, Map<string, string>>();
  private categoryHierarchyCache: CategoryHierarchyCache = {
    hierarchyMap: new Map(),
    parentChildMap: new Map(),
    processedCategories: new Set(),
  };

  private readonly apiClient: ApiClientV4;

  constructor(
    apiClient: ApiClientV4,
    inputFilePath: string,
    outputFilePath: string,
    logger: Logger,
    options: Partial<ConvertorOptions> = defaultOptions,
  ) {
    this.apiClient = apiClient;
    this.inputFilePath = inputFilePath;
    this.inputDirPath = path.dirname(inputFilePath);
    this.outputFilePath = outputFilePath;
    this.logger = logger;
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.existingCategories = undefined;
    this.skipMissingCategories = DEFAULT_SKIP_MISSING_CATEGORIES;
  }

  private async writeJSON<T>(data: T, outputPath: string): Promise<void> {
    try {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    }
    catch (error) {
      this.logger.error(`Failed to write JSON to ${outputPath}:`, error);
      throw error;
    }
  }

  private async readJSON<T>(relativePath: string): Promise<T | undefined> {
    const filePath = path.join(this.inputDirPath!, relativePath);
    try {
      await fs.access(filePath);
    }
    catch (e: unknown) {
      this.logger.debug(`File ${filePath} does not exist or is not accessible, skipping\n ${e}`);
      return undefined;
    }

    return JSON.parse(await fs.readFile(filePath, 'utf-8'));
  }

  private async readLocaleId(): Promise<string | null> {
    this.logger.info('Loading locales');
    this.locales = await this.readJSON(PkgConstants.LOCALES_FILE_NAME);
    if (this.locales?.length) {
      this.logger.debug(`Loaded ${this.locales[0].id} locale`);
      return this.locales[0].id;
    }
    this.logger.debug('No locales found');
    return null;
  }

  private async readCategoryPsm(): Promise<DefaultPSMCategory[] | undefined> {
    this.logger.info('Loading category PSM');
    const categoryPsmJSON = await this.readJSON<DefaultPSMCategory[]>(
      PkgConstants.CATEGORY_PSM_FILE_NAME,
    );

    if (categoryPsmJSON?.length) {
      this.logger.debug(`Loaded ${categoryPsmJSON.length} category PSMs`);
      return categoryPsmJSON;
    }

    this.logger.debug('No category PSMs found');
    return undefined;
  }

  // Validate CSV structure against JSON structure (TODO: move to the DB service)
  private validateCsvStructure = (headers: string[]): boolean => {
    this.logger.debug('Validating CSV structure');

    if (!this.csvStructure || !headers.length) {
      this.logger.debug('Invalid CSV structure or empty headers');
      return false;
    }

    const validHeaders = new Set(Object.keys(this.csvStructure).map(h => h.trim().toLowerCase()));

    return headers.every((header) => {
      if (!header) {
        this.logger.debug('Empty header found');
        return false;
      }

      const normalizedHeader = header.trim().toLowerCase();
      const isValid = validHeaders.has(normalizedHeader);

      if (!isValid) {
        this.logger.debug(`Invalid header: ${header}`);
      }

      return isValid;
    });
  };

  private validateRequiredFieldsExist = (headers: string[]): boolean => {
    this.logger.debug('Validating required fields');

    if (!this.csvStructure) {
      this.logger.debug('CSV structure not loaded');
      return false;
    }

    const requiredFields = Object.entries(this.csvStructure)
      .filter(([, record]) => record.required)
      .map(([header, _]) => header.trim().toLowerCase());

    if (!requiredFields.length) {
      this.logger.debug('No required fields defined');
      return true;
    }

    const headerSet = new Set(headers.map(header => header.trim().toLowerCase()));

    this.logger.debug(`Provided headers: ${[...headerSet]}`);

    for (const field of requiredFields) {
      if (!headerSet.has(field)) {
        this.logger.debug(`Missing required field: ${field}`);
        return false;
      }
    }

    return true;
  };

  private async readCSVStructure(): Promise<void> {
    this.logger.info('Loading CSV structure');
    this.csvStructure
      = (await this.readJSON(PkgConstants.CSV_STRUCTURE_FILE_NAME)) || CsvFoodRecords;
  }

  private async readExistingCategories(): Promise<string[]> {
    const existingCategories = await this.readJSON<existingCategories[]>(
      PkgConstants.CSV_EXISTING_CATEGORIES_FILE_NAME,
    );
    if (!existingCategories || existingCategories.length === 0) {
      this.logger.error('No existing categories found');
      return [];
    }
    return existingCategories.map(category => category.code);
  }

  private determineRecipeUse = (useInRecipes: string): number => {
    switch (useInRecipes) {
      case 'RegularFoodsOnly':
        return 0;
      case 'RecipesOnly':
        return 1;
      default:
        return 0;
    }
  };

  private determineNutrientTableCodes = (
    foodCompositionTable: string,
    foodCompositionTableCode: string,
  ): Record<string, string> => {
    foodCompositionTable
      = foodCompositionTable?.length > 0 ? foodCompositionTable : DEFAULT_FOOD_COMPOSITION_TABLE;
    foodCompositionTableCode
      = foodCompositionTableCode?.length > 0
        ? foodCompositionTableCode
        : DEFAULT_FOOD_COMPOSITION_TABLE_CODE;
    return {
      [foodCompositionTable.trim()]: foodCompositionTableCode.trim(),
    };
  };

  // Validate the categories in the CSV file against the existing categories
  private determineIfGlobalCategoriesExist = async (
    categories: string,
    existingCategories: string[],
  ): Promise<string[]> => {
    this.logger.debug('Validating categories');

    if (!categories?.trim() || !existingCategories?.length) {
      this.logger.debug('No categories to validate or no existing categories');
      return [];
    }

    try {
      const categoriesSet = new Set(existingCategories);
      const newCategories = categories
        .split(',')
        .map(category => category.trim())
        .filter(Boolean) // Remove empty strings
        .filter(category => !categoriesSet.has(category));

      if (newCategories.length) {
        this.logger.debug(`Found new categories: ${newCategories.join(', ')}`);
      }

      return newCategories;
    }
    catch (error) {
      this.logger.error(
        `Error processing categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return [];
    }
  };

  // Create a Map of the existing categories leaf - key, all parent categories - value
  private determineCategoriesHierarchy = async (
    level: number,
    category: CategoryHeader,
    parentCategories: string[] = [],
  ): Promise<Map<string, string[]>> => {
    if (!category?.code || !this.localeId) {
      throw new Error('Invalid category or missing localeId');
    }

    const result = new Map<string, string[]>();
    const categoryPath = [...parentCategories, category.code];
    const categoryKey = `${category.code}:_${randomUUID().slice(0, 8)}`;

    try {
      result.set(categoryKey, parentCategories);

      const contents = await this.fetchCategoryContents(category.code);

      if (!contents?.subcategories?.length) {
        return result;
      }

      const batchSize = 10;
      const batches: CategoryHeader[][] = [];

      for (let i = 0; i < contents.subcategories.length; i += batchSize) {
        batches.push(contents.subcategories.slice(i, i + batchSize));
      }

      const batchResults = await Promise.all(
        batches.map(batch => this.processCategoryBatch(batch, level + 1, categoryPath)),
      );

      batchResults.forEach((batchMap) => {
        batchMap.forEach((value, key) => result.set(key, value));
      });

      return result;
    }
    catch (error) {
      this.logger.error(
        `Error processing category ${category.code} at level ${level}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw error;
    }
  };

  private async fetchCategoryContents(categoryCode: string) {
    try {
      if (this.categoryCache.contents.has(categoryCode)) {
        return this.categoryCache.contents.get(categoryCode)!;
      }

      const contents = await this.apiClient.categories.getCategoryContents(
        categoryCode,
        this.localeId!,
      );
      this.categoryCache.contents.set(categoryCode, contents);

      return contents;
    }
    catch (error) {
      this.logger.error(
        `Failed to fetch category contents for ${categoryCode}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw error;
    }
  }

  private async processCategoryBatch(
    categories: CategoryHeader[],
    level: number,
    parentCategories: string[] = [],
  ): Promise<Map<string, string[]>> {
    const results = await Promise.all(
      categories.map(category =>
        this.determineCategoriesHierarchy(level, category, parentCategories),
      ),
    );

    return results.reduce((mergedMap, currentMap) => {
      currentMap.forEach((value, key) => mergedMap.set(key, value));
      return mergedMap;
    }, new Map<string, string[]>());
  }

  private mapCategoryHierarchy = async (
    categories: CategoryContents,
  ): Promise<Map<string, string[]>> => {
    // Build the cache first if not already built
    if (this.categoryHierarchyCache.processedCategories.size === 0) {
      await this.buildCategoryHierarchyCache(categories);
    }

    // Use the pre-built cache for faster processing
    const batchSize = 10;
    const batches: CategoryHeader[][] = [];

    for (let i = 0; i < categories.subcategories.length; i += batchSize) {
      batches.push(categories.subcategories.slice(i, i + batchSize));
    }

    // Process batches using the cache
    const results = await Promise.all(
      batches.map(async (batch) => {
        const batchResults = new Map<string, string[]>();

        for (const category of batch) {
          const categoryKey = `${category.code}:_${randomUUID().slice(0, 8)}`;
          const parents = this.categoryHierarchyCache.parentChildMap.get(category.code);

          if (parents) {
            batchResults.set(categoryKey, Array.from(parents));
            // Also cache the result in hierarchyMap for future use
            this.categoryHierarchyCache.hierarchyMap.set(categoryKey, Array.from(parents));
          }
        }

        return batchResults;
      }),
    );

    return results.reduce((mergedMap, currentMap) => {
      currentMap.forEach((value, key) => mergedMap.set(key, value));
      return mergedMap;
    }, new Map<string, string[]>());
  };

  private async batchProcessCategories(
    categories: string[],
  ): Promise<Map<string, 'category' | 'food' | 'unknown'>> {
    const uncachedCategories = categories.filter(cat => !this.categoryCache.lookup.has(cat));

    if (uncachedCategories.length === 0) {
      return this.categoryCache.lookup;
    }

    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < uncachedCategories.length; i += batchSize) {
      batches.push(uncachedCategories.slice(i, i + batchSize));
    }

    await Promise.all(
      batches.map(async (batch) => {
        const responses = await Promise.all(
          batch.map(code =>
            Promise.all([
              this.apiClient.foods.findGlobalFood(code),
              this.apiClient.categories.list({ search: code, limit: 1 }),
            ]),
          ),
        );

        responses.forEach(([food, { data }], index) => {
          const code = batch[index];
          const type = food ? 'food' : data.length ? 'category' : 'unknown';
          this.categoryCache.lookup.set(code, type);
        });
      }),
    );

    return this.categoryCache.lookup;
  }

  private linkAssociatedFoodCategories = async (
    associatedFoodCategory: string,
  ): Promise<PkgAssociatedFood[]> => {
    if (!associatedFoodCategory.trim())
      return [];

    const categories = associatedFoodCategory.split(',').map(c => c.trim());
    const lookup = await this.batchProcessCategories(categories);

    return categories.map(category => ({
      foodCode: lookup.get(category) === 'food' ? category : undefined,
      categoryCode: lookup.get(category) === 'category' ? category : undefined,
      linkAsMain: false,
      promptText: { en: '' },
      genericName: { en: '' },
    }));
  };

  // Check if the parent categories have a default PSM
  private checkForCategoryDefaultPsm = (parentCategories: string[]): string => {
    this.logger.info(`Checking for default PSM - ${parentCategories.join(', ')}`);
    if (parentCategories.length === 0 || !this.categoryPsm)
      return '';
    const defaultPsm: string = '';
    // get the first PSM for the parent category that has PSM in the this.categoryPsm
    for (const category of parentCategories) {
      const psm = this.categoryPsm.find(psm => psm.code === category)?.psm;
      this.logger.info(`PSM for category ${category} - ${psm}`);
      if (psm)
        return psm;
    }
    return defaultPsm;
  };

  private parseKeyValuePairs(line: string): Map<string, string> {
    if (this.keyValuePairCache.has(line)) {
      return this.keyValuePairCache.get(line)!;
    }

    const pairs = new Map<string, string>();
    line.split(',').forEach((pair) => {
      const [key, ...values] = pair.trim().split(': ');
      pairs.set(key, values.join(': '));
    });

    this.keyValuePairCache.set(line, pairs);
    return pairs;
  }

  // private fromCSVPortionSizeMethodPackage = (psm: string): PkgPortionSizeMethod[] => {
  //   this.logger.debug(`Processing PSM - ${psm}`);
  //   const psmToUse = psm;
  //   // TODO: Check if the parent categories have a default PSM
  //   // const psmToUse = psm.length > 0 ? psm : this.checkForCategoryDefaultPsm(parentCategories);

  //   if (!psmToUse || psmToUse.length === 0) return [];
  //   const normalizedPsm: PkgPortionSizeMethod[] = [];
  //   const lines = psm.split('\n').map(method => method.trim());
  //   lines.forEach(line => {
  //     const keyValuePairs = line.split(',').map(pair => pair.trim().split(': '));
  //     const method = keyValuePairs.find(pair => pair[0] === 'Method')?.[1];
  //     const useForRecipes = keyValuePairs.find(pair => pair[0] === 'use for recipes')?.[1];
  //     const conversionFactor = keyValuePairs.find(pair => pair[0] === 'conversion')?.[1];
  //     const servingImageSet = keyValuePairs.find(pair => pair[0] === 'serving-image-set')?.[1];
  //     const leftoversImageSet = keyValuePairs.find(pair => pair[0] === 'leftovers-image-set')?.[1];
  //     this.logger.info(
  //       `Method: ${method}, useForRecipes: ${useForRecipes}, conversionFactor: ${conversionFactor}`,
  //     );

  //     allThePsmInTheImportCSV.add(method!);
  //     switch (method) {
  //       case 'as-served':
  //         normalizedPsm.push({
  //           method: 'as-served',
  //           description: 'use_an_image',
  //           conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
  //           leftoversImageSet: leftoversImageSet ?? '',
  //           useForRecipes: useForRecipes === 'true',
  //           servingImageSet: servingImageSet ?? '',
  //         });
  //         break;
  //       case 'guide-image':
  //         normalizedPsm.push({
  //           method: 'guide-image',
  //           description: 'use_a_guided__image',
  //           conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
  //           guideImageId: keyValuePairs.find(pair => pair[0] === 'guide-image-id')?.[1] ?? '',
  //           useForRecipes: useForRecipes === 'true',
  //         });
  //         break;
  //       case 'drink-scale':
  //         normalizedPsm.push({
  //           method: 'drink-scale',
  //           description: 'use_a_drinkware_image',
  //           conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
  //           drinkwareId: keyValuePairs.find(pair => pair[0] === 'drinkware-id')?.[1] ?? '',
  //           initialFillLevel: Number.parseFloat(
  //             keyValuePairs.find(pair => pair[0] === 'initial-fill-level')?.[1] ?? '0.9',
  //           ),
  //           skipFillLevel:
  //             keyValuePairs.find(pair => pair[0] === 'skip-fill-level')?.[1] === 'true',
  //           useForRecipes: useForRecipes === 'true',
  //         });
  //         break;
  //       case 'standard-portion':
  //         {
  //           const unitCount = Number.parseInt(
  //             keyValuePairs.find(pair => pair[0] === 'units-count')?.[1] ?? '0',
  //           );
  //           const units: PkgStandardUnit[] = [];
  //           if (unitCount) {
  //             for (let i = 0; i < unitCount; i++) {
  //               const name = keyValuePairs.find(pair => pair[0] === `unit${i}-name`)?.[1];
  //               const weight = keyValuePairs.find(pair => pair[0] === `unit${i}-weight`)?.[1];
  //               const omitFoodDescription =
  //                 keyValuePairs.find(pair => pair[0] === `unit${i}-omit-food-description`)?.[1] ===
  //                 'true';
  //               units.push({
  //                 name: name ?? '',
  //                 weight: Number.parseFloat(weight ?? '0'),
  //                 omitFoodDescription,
  //                 inlineEstimateIn: '',
  //                 inlineHowMany: '',
  //               });
  //             }
  //           }

  //           normalizedPsm.push({
  //             method: 'standard-portion',
  //             description: 'use_a_standard_portion',
  //             conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
  //             units,
  //             useForRecipes: useForRecipes === 'true',
  //           });
  //         }
  //         break;
  //       case 'cereal':
  //         normalizedPsm.push({
  //           method: 'cereal',
  //           description: 'use_a_cereal_portion',
  //           conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
  //           type: keyValuePairs.find(pair => pair[0] === 'cereal-type')?.[1] ?? '',
  //           useForRecipes: useForRecipes === 'true',
  //         });
  //         break;
  //       case 'pizza':
  //         normalizedPsm.push({
  //           method: 'pizza',
  //           description: 'use_a_pizza_portion',
  //           conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
  //           useForRecipes: useForRecipes === 'true',
  //         });
  //         break;
  //       case 'milk-on-cereal':
  //         normalizedPsm.push({
  //           method: 'milk-on-cereal',
  //           description: 'use_a_milk_on_cereal_portion',
  //           conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
  //           useForRecipes: useForRecipes === 'true',
  //         });
  //         break;
  //       case 'milk-in-a-hot-drink':
  //         normalizedPsm.push({
  //           method: 'milk-in-a-hot-drink',
  //           description: 'use_a_milk_in_a_hot_drink_portion',
  //           conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
  //           useForRecipes: useForRecipes === 'true',
  //         });
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  //   return normalizedPsm;
  // };

  private fromCSVPortionSizeMethodPackage = (psm: string): PkgPortionSizeMethod[] => {
    if (!psm?.trim())
      return [];

    if (this.psmCache.has(psm)) {
      return this.psmCache.get(psm)!;
    }

    const normalizedPsm: PkgPortionSizeMethod[] = [];
    const lines = psm.split('\n');

    for (const line of lines) {
      const pairs = this.parseKeyValuePairs(line);
      const method = pairs.get('Method');
      if (!method)
        continue;

      const useForRecipes = pairs.get('use for recipes') === 'true';
      const conversionFactor = Number(pairs.get('conversion')) || 1;

      allThePsmInTheImportCSV.add(method);

      const psmMethod = this.createPSMMethod(method, pairs, useForRecipes, conversionFactor);
      if (psmMethod)
        normalizedPsm.push(psmMethod);
    }

    this.psmCache.set(psm, normalizedPsm);
    return normalizedPsm;
  };

  private createPSMMethod(
    method: string,
    pairs: Map<string, string>,
    useForRecipes: boolean,
    conversionFactor: number,
  ): PkgPortionSizeMethod | null {
    switch (method) {
      case 'as-served':
        return {
          method,
          description: 'use_an_image',
          conversionFactor,
          useForRecipes,
          servingImageSet: pairs.get('serving-image-set') ?? '',
          leftoversImageSet: pairs.get('leftovers-image-set') ?? '',
        };

      case 'guide-image':
        return {
          method,
          description: 'use_a_guided__image',
          conversionFactor,
          useForRecipes,
          guideImageId: pairs.get('guide-image-id') ?? '',
        };

      case 'drink-scale':
        return {
          method,
          description: 'use_a_drinkware_image',
          conversionFactor,
          useForRecipes,
          drinkwareId: pairs.get('drinkware-id') ?? '',
          initialFillLevel: Number(pairs.get('initial-fill-level')) || 0.9,
          skipFillLevel: pairs.get('skip-fill-level') === 'true',
        };

      case 'standard-portion': {
        const unitCount = Number(pairs.get('units-count')) || 0;
        const units: PkgStandardUnit[] = [];

        if (unitCount > 0) {
          for (let i = 0; i < unitCount; i++) {
            units.push({
              name: pairs.get(`unit${i}-name`) ?? '',
              weight: Number(pairs.get(`unit${i}-weight`)) || 0,
              omitFoodDescription: pairs.get(`unit${i}-omit-food-description`) === 'true',
              inlineEstimateIn: '',
              inlineHowMany: '',
            });
          }
        }

        return {
          method,
          description: 'use_a_standard_portion',
          conversionFactor,
          useForRecipes,
          units,
        };
      }

      case 'cereal':
        return {
          method,
          description: 'use_a_cereal_portion',
          conversionFactor,
          useForRecipes,
          type: pairs.get('type') ?? '',
        };

      case 'pizza':
        return {
          method,
          description: 'use_a_pizza_portion',
          conversionFactor,
          useForRecipes,
        };

      case 'milk-on-cereal':
        return {
          method,
          description: 'use_a_milk_on_cereal_portion',
          conversionFactor,
          useForRecipes,
        };

      case 'milk-in-a-hot-drink':
        return {
          method,
          description: 'use_a_milk_in_a_hot_drink_portion',
          conversionFactor,
          useForRecipes,
        };

      default:
        this.logger.debug(`Unknown PSM method: ${method}`);
        return null;
    }
  }

  private async createLocalCategoryListAndWriteJSON(localeId: string) {
    const categoryPsm = await this.readCategoryPsm();

    if (!categoryPsm?.length) {
      this.logger.warn(`Category PSM for locale ${this.localeId} does not exist`);
      return;
    }

    const batchSize = 50;
    const results: PkgLocalCategory[] = [];

    for (let i = 0; i < categoryPsm.length; i += batchSize) {
      const batch = categoryPsm.slice(i, i + batchSize);
      const batchPromises = batch.map(async (record) => {
        const [category] = (
          await this.apiClient.categories.list({
            page: 1,
            limit: 1,
            search: record.code,
          })
        ).data;

        return {
          version: randomUUID(),
          code: record.code,
          localDescription: category.name,
          portionSize: this.fromCSVPortionSizeMethodPackage(record.psm),
        };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    await this.writeJSON(
      { [localeId]: results },
      path.join(this.outputFilePath, PkgConstants.LOCAL_CATEGORIES_FILE_NAME),
    );
  }

  private async createGlobalFoodListAndWriteJSON(data: CsvFoodRecordUnprocessed[]) {
    const globalFoodList: PkgGlobalFood[] = [];

    this.existingCategories
      = (await this.readExistingCategories())
      || (await this.apiClient.categories.getAllCategories()).map(category => category.code);

    const localeRootCategories = await this.apiClient.categories.getRootCategories(
      this.localeId ?? '',
    );

    await this.buildCategoryHierarchyCache(localeRootCategories);
    // const localeCategoriesHierarchy = await this.mapCategoryHierarchy(localeRootCategories);

    this.logger.info('Creating global food list');

    const ADD_NEW_GLOBAL_FOOD_ACTION = '5';

    const batchSize = 100;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (record) => {
          if (record.action !== ADD_NEW_GLOBAL_FOOD_ACTION)
            return;

          this.logger.info(`Processing global food ${record['intake24 code']}`);
          const parentCategoriesUnique = [
            ...new Set(record.categories.split(',').map(category => category.trim())),
          ];
          const missingCategories = await this.determineIfGlobalCategoriesExist(
            record.categories,
            this.existingCategories!,
          );

          if (missingCategories.length > 0) {
            const message = `Categories ${missingCategories} for food ${record['intake24 code']} do not exist in the existing categories list.`;
            if (!this.skipMissingCategories) {
              this.logger.error(`${message} ERROR`);
              return;
            }
            this.logger.warn(`${message} SKIPPING`);
            parentCategoriesUnique.filter(category => !missingCategories.includes(category));
          }

          const parentCategoriesFiltered = this.filterParentCategories(parentCategoriesUnique);
          const cleanedParentCategories = parentCategoriesUnique.filter(
            category => !parentCategoriesFiltered.includes(category),
          );

          globalFoodList.push(this.createGlobalFood(record, cleanedParentCategories));
        }),
      );
    }

    this.globalFoodList = globalFoodList;

    await this.writeJSON(
      this.globalFoodList,
      path.join(this.outputFilePath, PkgConstants.GLOBAL_FOODS_FILE_NAME),
    );
  }

  private filterParentCategories(categories: string[]): string[] {
    const result = new Set<string>();
    const processedCategories = new Set<string>();

    // Use the pre-built parent-child map for faster lookups
    for (const category of categories) {
      if (processedCategories.has(category))
        continue;
      processedCategories.add(category);

      const parents = this.categoryHierarchyCache.parentChildMap.get(category);
      if (parents) {
        parents.forEach(parent => result.add(parent));
      }
    }

    return Array.from(result);
  }

  private async buildCategoryHierarchyCache(categories: CategoryContents) {
    const queue = [...categories.subcategories];
    const processed = new Set<string>();

    while (queue.length > 0) {
      const batchSize = 10;
      const batch = queue.splice(0, batchSize);

      await Promise.all(
        batch.map(async (category) => {
          if (processed.has(category.code))
            return;

          const contents = await this.fetchCategoryContents(category.code);
          processed.add(category.code);

          if (contents?.subcategories) {
            queue.push(...contents.subcategories);

            // Build parent-child relationships
            contents.subcategories.forEach((child) => {
              const childSet
                = this.categoryHierarchyCache.parentChildMap.get(category.code) || new Set();
              childSet.add(child.code);
              this.categoryHierarchyCache.parentChildMap.set(category.code, childSet);
            });
          }
        }),
      );
    }
  }

  private createGlobalFood(
    record: CsvFoodRecordUnprocessed,
    parentCategories: string[],
  ): PkgGlobalFood {
    return {
      version: randomUUID(),
      code: record['intake24 code'],
      englishDescription: record['english description'],
      groupCode: 1,
      attributes: {
        useInRecipes:
          this.determineAttribute(record['use in recipes'], this.determineRecipeUse) || undefined,
        readyMealOption:
          this.determineAttribute(
            record['ready meal option'],
            val => val.toLowerCase() === 'true',
          ) || undefined,
        reasonableAmount:
          this.determineAttribute(record['reasonable amount'], val =>
            Number.isNaN(Number.parseInt(val)) ? 0 : Number.parseInt(val)) || undefined,
        sameAsBeforeOption:
          this.determineAttribute(
            record['same as before option'],
            val => val.toLowerCase() === 'true',
          ) || undefined,
      },
      parentCategories,
    };
  }

  private determineAttribute<T>(
    value: string | undefined,
    parser: (val: string) => T,
  ): T | 0 | false {
    return value && value !== 'Inherited'
      ? parser(value)
      : typeof parser('') === 'number'
        ? 0
        : false;
  }

  private async createLocalFoodListAndWriteJSON(
    data: CsvFoodRecordUnprocessed[],
    localeId: string,
  ) {
    const localFoodList: PkgLocalFood[] = [];
    const enabledLocalesFoodList: string[] = [];
    const localCategories: PkgLocalCategory[] = [];

    const EXCLUDE_FOOD_ACTION = '1';

    for (const record of data) {
      if (record.action === EXCLUDE_FOOD_ACTION) {
        this.logger.info(`Food ${record['intake24 code']} is excluded, skipping`);
        continue;
      }

      const localPsm = this.fromCSVPortionSizeMethodPackage(
        record['portion size estimation methods'],
      );
      // this.logger.info(`Local PSM for food ${record['intake24 code']}: ${localPsm.map(psm => psm.method).join(', ')}`);

      const localFood: PkgLocalFood = {
        version: randomUUID(),
        code: record['intake24 code'],
        localDescription:
          // @ts-expect-error('Provided CSV doesn't always match the type defined')
          record['local description/chinese']?.trim()
          || record['local description']?.trim()
          || record['english description'].trim(),
        nutrientTableCodes: this.determineNutrientTableCodes(
          record['food composition table'],
          record['food composition record id'],
        ),
        associatedFoods: await this.linkAssociatedFoodCategories(
          record['associated food or category'],
        ),
        portionSize: localPsm,
        brandNames: [],
      };
      localFoodList.push(localFood);
      enabledLocalesFoodList.push(localFood.code);
    }

    this.localFoodList = localFoodList;
    this.enabledLocalesFoodList = enabledLocalesFoodList;
    this.localCategories = localCategories;

    await Promise.all([
      this.writeJSON(
        { [localeId]: this.localFoodList },
        path.join(this.outputFilePath, PkgConstants.LOCAL_FOODS_FILE_NAME),
      ),
      this.writeJSON(
        { [localeId]: this.enabledLocalesFoodList },
        path.join(this.outputFilePath, PkgConstants.ENABLED_LOCAL_FOODS_FILE_NAME),
      ),
      this.writeJSON(
        { [localeId]: this.localCategories },
        path.join(this.outputFilePath, PkgConstants.LOCAL_CATEGORIES_FILE_NAME),
      ),
    ]);

    if (new Set(this.enabledLocalesFoodList).size !== this.enabledLocalesFoodList.length) {
      this.logger.error('Duplicate food codes found in the enabled local foods list');
    }
  }

  // Process the CSV file, while ensuring headers are validated before processing data
  private processCsvFile = async (csvFilePath: string): Promise<CsvFoodRecordUnprocessed[]> => {
    const results: CsvFoodRecordUnprocessed[] = [];
    const chunkSize = 1000;
    let currentChunk: CsvFoodRecordUnprocessed[] = [];

    const processChunk = async (chunk: CsvFoodRecordUnprocessed[]) => {
      const processed = await Promise.all(
        chunk.map(async (record) => {
          const trimmedRecord = Object.fromEntries(
            Object.entries(record).map(([key, value]) => [
              key.trim().toLowerCase(),
              typeof value === 'string' ? value.trim() : value,
            ]),
          ) as CsvFoodRecordUnprocessed;

          return trimmedRecord;
        }),
      );
      results.push(...processed);
    };

    await new Promise<void>((resolve, reject) => {
      createReadStream(csvFilePath, {
        encoding: 'utf-8',
        highWaterMark: 256 * 1024, // Increased buffer size
      })
        .pipe(
          csv({
            mapValues: ({ value }) => value,
            mapHeaders: ({ header }) => header.trim().toLowerCase(),
            strict: true,
            skipLines: 0,
          }),
        )
        .on('headers', (headers: string[]) => {
          if (!this.validateCsvStructure(headers) || !this.validateRequiredFieldsExist(headers)) {
            reject(new Error('Invalid CSV structure'));
          }
        })
        .on('data', (record: CsvFoodRecordUnprocessed) => {
          currentChunk.push(record);
          if (currentChunk.length >= chunkSize) {
            const chunkToProcess = [...currentChunk];
            currentChunk = [];
            processChunk(chunkToProcess);
          }
        })
        .on('end', async () => {
          if (currentChunk.length > 0) {
            await processChunk(currentChunk);
          }
          resolve();
        })
        .on('error', reject);
    });

    return results;
  };

  // Main function to initiate the CSV importer
  private processCSVImport = async (options: {
    structure: typeof CsvFoodRecords | undefined;
    importedFile: string;
  }): Promise<CsvResultStructure[] | undefined> => {
    if (!options.structure) {
      this.logger.debug('No structure file found, skipping CSV import');
      return undefined;
    }

    try {
      // 0. Make sure that locale is loaded
      this.localeId = await this.readLocaleId();
      if (!this.localeId) {
        throw new Error('No locale found');
      }

      // Load necessary data concurrently
      const [categoryPsm, unprocessedRecords] = await Promise.all([
        this.readCategoryPsm(),
        this.processCsvFile(options.importedFile),
      ]);

      this.categoryPsm = categoryPsm;

      // Process data concurrently
      await Promise.all([
        this.createGlobalFoodListAndWriteJSON(unprocessedRecords),
        this.createLocalFoodListAndWriteJSON(unprocessedRecords, this.localeId),
        this.createLocalCategoryListAndWriteJSON(this.localeId),
      ]);

      this.logger.info('Creating local food list');

      // TODO: Implement these methods
      // this.createEnabledLocalesFoodList(data);
      // Convert to the PortionSizeMethod JSON structure
      // TODO: Add the rest of the structures
    }
    catch (error) {
      this.logger.error('Error processing files:', error);
      throw error; // Re-throw to allow caller to handle
    }
  };

  async convert() {
    this.logger.debug('Converting to package');
    const fileExtension = path.extname(this.inputFilePath);

    if (fileExtension !== '.csv') {
      this.logger.debug('Converting to package from unspecified file type');
      throw new Error('Unsupported file type');
    }

    this.logger.debug('Converting to package from CSV');
    await this.readCSVStructure();
    await this.processCSVImport({
      structure: this.csvStructure,
      importedFile: this.inputFilePath,
    });

    this.logger.info('Conversion complete');
    this.logger.info(`PSMs in the CSV file: ${[...allThePsmInTheImportCSV].join(', ')}`);
  }
}
