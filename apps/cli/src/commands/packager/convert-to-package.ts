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

import type logger from '@intake24/common-backend/services/logger/logger';
import { CategoryContents, CategoryHeader } from '@intake24/common/types/http';
import { PkgConstants } from './constants';
import { PkgLocalCategory } from './types/categories';
import { CsvFoodRecords } from './types/csv-import';
import { PkgLocale } from './types/locale';

interface CategoryCache {
  contents: Map<string, CategoryContents>;
  lookup: Map<string, { type: 'category' | 'food' | 'unknown'; name: string }>;
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
    this.logger.debug(`Raw headers from CSV: ${JSON.stringify(headers)}`);

    if (!this.csvStructure || !headers.length) {
      this.logger.debug('Invalid CSV structure or empty headers');
      return false;
    }

    // Filter out empty string columns
    const nonEmptyHeaders = headers.filter(header => header.trim() !== '');
    if (nonEmptyHeaders.length !== headers.length) {
      this.logger.info(`Found ${headers.length - nonEmptyHeaders.length} empty columns in CSV`);
    }

    // Normalize headers by removing spaces, underscores, and converting to lowercase
    const normalizedHeaders = nonEmptyHeaders.map(h => h.trim().toLowerCase().replace(/[_\s]+/g, ''));
    const validHeaders = new Set(Object.keys(this.csvStructure).map(h => h.trim().toLowerCase().replace(/[_\s]+/g, '')));

    this.logger.debug(`Normalized headers from CSV: ${JSON.stringify(normalizedHeaders)}`);
    this.logger.debug(`Valid headers from structure: ${JSON.stringify([...validHeaders])}`);

    const invalidHeaders = nonEmptyHeaders.filter((header, index) => {
      const normalized = normalizedHeaders[index];
      return !validHeaders.has(normalized);
    });

    if (invalidHeaders.length > 0) {
      this.logger.info(`Extra headers found in CSV that are not in the structure: ${invalidHeaders.join(', ')}`);
      return false;
    }

    return true;
  };

  private validateRequiredFieldsExist = (headers: string[]): boolean => {
    this.logger.debug('Validating required fields');
    this.logger.debug(`Raw headers from CSV: ${JSON.stringify(headers)}`);

    if (!this.csvStructure) {
      this.logger.debug('CSV structure not loaded');
      return false;
    }

    // Filter out empty string columns
    const nonEmptyHeaders = headers.filter(header => header.trim() !== '');
    if (nonEmptyHeaders.length !== headers.length) {
      this.logger.info(`Found ${headers.length - nonEmptyHeaders.length} empty columns in CSV`);
    }

    const requiredFields = Object.entries(this.csvStructure)
      .filter(([, record]) => record.required)
      .map(([header, _]) => header.trim().toLowerCase().replace(/[_\s]+/g, ''));

    this.logger.debug(`Required fields from structure: ${JSON.stringify(requiredFields)}`);

    if (!requiredFields.length) {
      this.logger.debug('No required fields defined');
      return true;
    }

    const normalizedHeaders = nonEmptyHeaders.map(h => h.trim().toLowerCase().replace(/[_\s]+/g, ''));
    this.logger.debug(`Normalized headers from CSV: ${JSON.stringify(normalizedHeaders)}`);

    const missingFields = requiredFields.filter(field => !normalizedHeaders.includes(field));
    if (missingFields.length > 0) {
      this.logger.info(`Missing required fields: ${missingFields.join(', ')}`);
      this.logger.debug(`Available headers: ${JSON.stringify(nonEmptyHeaders)}`);
      return false;
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

  private async getAllCategoriesFromPagination(): Promise<string[]> {
    const firstPage = await this.apiClient.categories.list({
      page: 1,
      limit: 50,
    });
    const totalPages = Math.ceil(firstPage.meta.total / firstPage.meta.limit);

    const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) =>
      this.apiClient.categories.list({ page: i + 2, limit: 50 }));

    const allPages = await Promise.all([Promise.resolve(firstPage), ...remainingPages]);

    return allPages.flatMap(page => page.data.map(category => category.code));
  }

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
  ): Promise<Map<string, { type: 'category' | 'food' | 'unknown'; name: string }>> {
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
          const type: { type: 'category' | 'food' | 'unknown'; name: string } = food
            ? { type: 'food', name: food.name }
            : data.length
              ? { type: 'category', name: data[0].name }
              : { type: 'unknown', name: '' };
          this.categoryCache.lookup.set(code, type);
        });
      }),
    );

    return this.categoryCache.lookup;
  }

  private linkAssociatedFoodCategories = async (
    associatedFoodCategory: string,
    language: 'malay' | 'mandarin' | 'tamil',
    englishDescription: string,
    localDescription: string,
  ): Promise<PkgAssociatedFood[]> => {
    if (!associatedFoodCategory?.trim())
      return [];

    const getPrompt = (
      language: 'malay' | 'mandarin' | 'tamil',
      category: string,
    ): { [key: string]: string } => {
      switch (language) {
        case 'malay':
          return {
            en: `Did you have ${category} with your ${englishDescription}`,
            ms: `Adakah anda makan ${category} bersama ${localDescription}?`,
          };
        case 'mandarin':
          return {
            en: `Did you have ${category} with your ${englishDescription}`,
            zh: `您有和 ${localDescription} 一起吃 ${category} 吗`,
          };
        case 'tamil':
          return {
            en: `Did you have ${category} with your ${englishDescription}`,
            ta: `${localDescription} உடன் சேர்த்து ${category} சாப்பிட்டீர்களா?`,
          };
        default:
          return {
            en: `Did you have ${category} with your ${englishDescription}`,
          };
      }
    };

    const categories = associatedFoodCategory.split(',').map(c => c.trim());
    const lookup = await this.batchProcessCategories(categories);

    return categories.map(category => ({
      foodCode: lookup.get(category)?.type === 'food' ? category : undefined,
      categoryCode: lookup.get(category)?.type === 'category' ? category : undefined,
      linkAsMain: false,
      promptText: getPrompt(language, lookup.get(category)?.name ?? ''),
      genericName: getPrompt(language, lookup.get(category)?.name ?? ''),
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
    const pairs = new Map<string, string>();

    // 1) Trim off any leading/trailing whitespace
    // 2) Split on the single literal space before the next "foo-bar:"
    //    (you only ever split once per key, so it's O(n))
    const parts = line
      .trim()
      .split(/ (?=[a-z0-9-]+:)/i);

    for (const part of parts) {
      const sep = part.indexOf(':');
      if (sep === -1)
        continue;
      const key = part.substring(0, sep).trim();
      let value = part.substring(sep + 1).trim();

      // Remove trailing comma if present
      if (value.endsWith(','))
        value = value.slice(0, -1).trim();

      pairs.set(key, value);
    }

    return pairs;
  }

  private validatePsmFormat(record: CsvFoodRecordUnprocessed, parsedPsm: PkgPortionSizeMethod[]): void {
    const foodIdentifier = `${record['english description']} (${record['intake24 code']})`;

    if (!record['portion size estimation methods']?.trim()) {
      this.logger.warn(`Food "${foodIdentifier}" has no PSM defined`);
      return;
    }

    // Log the original PSM string and parsed result for debugging
    this.logger.debug(`Original PSM for "${foodIdentifier}":`);
    this.logger.debug(record['portion size estimation methods']);
    this.logger.debug('Parsed PSM:');
    this.logger.debug(JSON.stringify(parsedPsm, null, 2));

    // Validate each PSM method
    const methods = record['portion size estimation methods'].split('\n');
    methods.forEach((methodStr, index) => {
      const pairs = this.parseKeyValuePairs(methodStr);
      const method = pairs.get('Method');

      if (!method) {
        this.logger.error(`Invalid PSM format for "${foodIdentifier}" - Missing Method in entry ${index + 1}`);
        return;
      }

      // Validate required fields for each method type
      switch (method) {
        case 'as-served':
          if (!pairs.get('serving-image-set')) {
            this.logger.error(`Invalid as-served PSM for "${foodIdentifier}" - Missing serving-image-set`);
          }
          break;
        case 'guide-image':
          if (!pairs.get('guide-image-id')) {
            this.logger.error(`Invalid guide-image PSM for "${foodIdentifier}" - Missing guide-image-id`);
          }
          break;
        case 'drink-scale':
          if (!pairs.get('drinkware-id')) {
            this.logger.error(`Invalid drink-scale PSM for "${foodIdentifier}" - Missing drinkware-id`);
          }
          break;
        case 'standard-portion': {
          const unitCount = Number.parseInt(pairs.get('units-count') || '0', 10);
          if (Number.isNaN(unitCount) || unitCount === 0) {
            this.logger.error(`Invalid standard-portion PSM for "${foodIdentifier}" - Invalid or missing units-count`);
          }
          else {
            // Validate each unit
            for (let i = 0; i < unitCount; i++) {
              if (!pairs.get(`unit${i}-name`) || !pairs.get(`unit${i}-weight`)) {
                this.logger.error(`Invalid standard-portion PSM for "${foodIdentifier}" - Missing unit${i} details`);
              }
            }
          }
          break;
        }
      }

      // Validate conversion factor for all methods
      const conversion = Number.parseFloat(pairs.get('conversion') || '0');
      if (Number.isNaN(conversion) || conversion <= 0) {
        this.logger.error(`Invalid PSM for "${foodIdentifier}" - Invalid or missing conversion factor`);
      }
    });

    // Compare original method count with parsed result
    if (methods.length !== parsedPsm.length) {
      this.logger.error(
        `PSM parsing mismatch for "${foodIdentifier}" - Expected ${methods.length} methods, got ${parsedPsm.length}`,
      );
    }
  }

  private createPSMMethod(
    method: string,
    pairs: Map<string, string>,
    useForRecipes: boolean,
    conversionFactor: number,
  ): PkgPortionSizeMethod | null {
    this.logger.debug(`Creating PSM method: ${method}`);
    this.logger.debug(`Parameters: ${JSON.stringify(Object.fromEntries(pairs))}`);

    switch (method) {
      case 'as-served': {
        const servingImageSet = pairs.get('serving-image-set');
        const leftoversImageSet = pairs.get('leftovers-image-set');

        if (!servingImageSet) {
          this.logger.warn(`Missing serving-image-set for as-served PSM`);
          return null;
        }

        this.logger.debug(`Creating as-served PSM with servingImageSet: ${servingImageSet}, leftoversImageSet: ${leftoversImageSet}`);
        return {
          method,
          description: 'use_an_image',
          conversionFactor,
          useForRecipes,
          servingImageSet,
          leftoversImageSet: leftoversImageSet ?? '',
        };
      }

      case 'guide-image': {
        const guideImageId = pairs.get('guide-image-id');

        if (!guideImageId) {
          this.logger.warn(`Missing guide-image-id for guide-image PSM`);
          return null;
        }

        this.logger.debug(`Creating guide-image PSM with guideImageId: ${guideImageId}`);
        return {
          method,
          description: 'use_a_guided__image',
          conversionFactor,
          useForRecipes,
          guideImageId,
        };
      }

      case 'drink-scale': {
        const drinkwareId = pairs.get('drinkware-id');

        if (!drinkwareId) {
          this.logger.warn(`Missing drinkware-id for drink-scale PSM`);
          return null;
        }

        this.logger.debug(`Creating drink-scale PSM with drinkwareId: ${drinkwareId}`);
        return {
          method,
          description: 'use_a_drinkware_image',
          conversionFactor,
          useForRecipes,
          drinkwareId,
          initialFillLevel: Number(pairs.get('initial-fill-level')) || 0.9,
          skipFillLevel: pairs.get('skip-fill-level') === 'true',
        };
      }

      case 'standard-portion': {
        const unitCount = Number.parseInt(pairs.get('units-count') || '0', 10);
        if (Number.isNaN(unitCount) || unitCount === 0) {
          this.logger.warn(`Invalid or missing units-count for standard-portion PSM`);
          return null;
        }

        const units: PkgStandardUnit[] = [];
        for (let i = 0; i < unitCount; i++) {
          const name = pairs.get(`unit${i}-name`);
          const weight = Number(pairs.get(`unit${i}-weight`));
          const omitFoodDescription = pairs.get(`unit${i}-omit-food-description`) === 'true';

          if (!name || Number.isNaN(weight)) {
            this.logger.warn(`Invalid unit${i} details for standard-portion PSM`);
            continue;
          }

          units.push({
            name,
            weight,
            omitFoodDescription,
            inlineEstimateIn: '',
            inlineHowMany: '',
          });
        }

        if (units.length === 0) {
          this.logger.warn(`No valid units found for standard-portion PSM`);
          return null;
        }

        this.logger.debug(`Creating standard-portion PSM with ${units.length} units`);
        return {
          method,
          description: 'use_a_standard_portion',
          conversionFactor,
          useForRecipes,
          units,
        };
      }

      case 'cereal':
        this.logger.debug(`Creating cereal PSM with type: ${pairs.get('type')}`);
        return {
          method,
          description: 'use_a_cereal_portion',
          conversionFactor,
          useForRecipes,
          type: pairs.get('type') ?? '',
        };

      case 'pizza':
        this.logger.debug('Creating pizza PSM');
        return {
          method,
          description: 'use_a_pizza_portion',
          conversionFactor,
          useForRecipes,
        };

      case 'milk-on-cereal':
        this.logger.debug('Creating milk-on-cereal PSM');
        return {
          method,
          description: 'use_a_milk_on_cereal_portion',
          conversionFactor,
          useForRecipes,
        };

      case 'milk-in-a-hot-drink':
        this.logger.debug('Creating milk-in-a-hot-drink PSM');
        return {
          method,
          description: 'use_a_milk_in_a_hot_drink_portion',
          conversionFactor,
          useForRecipes,
        };

      default:
        this.logger.warn(`Unknown PSM method: ${method}`);
        return null;
    }
  }

  private fromCSVPortionSizeMethodPackage = (psm: string): PkgPortionSizeMethod[] => {
    if (!psm?.trim()) {
      this.logger.debug('Empty PSM string provided');
      return [];
    }

    if (this.psmCache.has(psm)) {
      this.logger.debug('Returning cached PSM');
      return this.psmCache.get(psm)!;
    }

    this.logger.debug(`Processing PSM string: ${psm}`);

    const normalizedPsm: PkgPortionSizeMethod[] = [];

    // Split input by lines with "Method:" prefix to handle multiple methods
    const methodLines = psm.split(/\n(?=Method:)/i);
    this.logger.debug(`Split into ${methodLines.length} method definitions`);

    for (const methodLine of methodLines) {
      if (!methodLine.trim())
        continue;

      this.logger.debug(`Processing method line: "${methodLine}"`);
      const pairs = this.parseKeyValuePairs(methodLine);
      this.logger.debug(`Parsed key-value pairs: ${JSON.stringify(Object.fromEntries(pairs))}`);

      const method = pairs.get('Method');
      if (!method) {
        this.logger.debug('No Method found in pairs');
        continue;
      }

      this.logger.debug(`Processing method: ${method}`);
      allThePsmInTheImportCSV.add(method);

      const useForRecipes = pairs.get('use for recipes') === 'true';
      const conversionRaw = pairs.get('conversion');
      const conversionFactor = conversionRaw ? Number(conversionRaw) : 1;

      this.logger.debug(`Creating PSM method with useForRecipes: ${useForRecipes}, conversionFactor: ${conversionFactor}`);
      const psmMethod = this.createPSMMethod(method, pairs, useForRecipes, conversionFactor);
      if (psmMethod) {
        this.logger.debug(`Successfully created PSM method: ${JSON.stringify(psmMethod)}`);
        normalizedPsm.push(psmMethod);
      }
      else {
        this.logger.debug('Failed to create PSM method');
      }
    }

    this.logger.debug(`Final normalized PSM array length: ${normalizedPsm.length}`);
    this.psmCache.set(psm, normalizedPsm);
    return normalizedPsm;
  };

  private async createLocalCategoryListAndWriteJSON(localeId: string) {
    const categoryPsm = await this.readCategoryPsm();

    if (!categoryPsm?.length) {
      this.logger.warn(`Category PSM for locale ${this.localeId} does not exist`);
      return;
    }

    // Use a proper concurrency pool
    const concurrencyLimit = 10;
    const results: PkgLocalCategory[] = [];

    // Process in chunks based on concurrency limit
    for (let i = 0; i < categoryPsm.length; i += concurrencyLimit) {
      const chunk = categoryPsm.slice(i, i + concurrencyLimit);
      const chunkResults = await Promise.all(
        chunk.map(async (record) => {
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
        }),
      );

      results.push(...chunkResults);
      this.logger.debug(`Processed ${results.length}/${categoryPsm.length} categories`);
    }

    await this.writeJSON(
      { [localeId]: results },
      path.join(this.outputFilePath, PkgConstants.LOCAL_CATEGORIES_FILE_NAME),
    );
  }

  private async createGlobalFoodListAndWriteJSON(data: CsvFoodRecordUnprocessed[]) {
    const globalFoodList: PkgGlobalFood[] = [];

    this.existingCategories
      = (await this.readExistingCategories()) || (await this.getAllCategoriesFromPagination());

    const localeRootCategories = await this.apiClient.categories.getRootCategories(
      this.localeId ?? '',
    );

    await this.buildCategoryHierarchyCache(localeRootCategories);
    // const localeCategoriesHierarchy = await this.mapCategoryHierarchy(localeRootCategories);

    this.logger.info('Creating global food list');

    const ADD_NEW_GLOBAL_FOOD_ACTION = '4';

    const batchSize = 100;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (record) => {
          if (record.action !== ADD_NEW_GLOBAL_FOOD_ACTION)
            return;

          // Skip records with null or empty intake24 codes
          if (!record['intake24 code']?.trim()) {
            const identifier = record['english description']?.trim() || 'Unknown food';
            this.logger.warn(`Skipping global food "${identifier}" with null or empty intake24 code`);
            return;
          }

          this.logger.info(`Processing global food ${record['intake24 code']}`);
          const parentCategoriesUnique = [
            ...new Set(record.categories.split(',').map(category => category.trim())),
          ];
          const missingCategories = await this.determineIfGlobalCategoriesExist(
            record.categories,
            this.existingCategories!,
          );

          if (missingCategories.length > 0) {
            const message = `Categories ${missingCategories} for food ${
              record['intake24 code']
            } do not exist in the existing categories list.`;
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
    const enabledLocalesFoodList = new Set<string>();
    const missingCodes: string[] = [];
    const invalidNutrientRecords: string[] = [];
    const psmValidationIssues: Set<string> = new Set();

    const EXCLUDE_FOOD_ACTION = '1';
    const LANGUAGE_FLAG: 'malay' | 'mandarin' | 'tamil' = 'mandarin';

    for (const record of data) {
      try {
        if (record.action === EXCLUDE_FOOD_ACTION) {
          this.logger.info(`Food ${record['intake24 code']} is excluded, skipping`);
          continue;
        }

        // Skip and log foods without intake24 code
        if (!record['intake24 code']?.trim()) {
          const identifier = record['english description']?.trim() || 'Unknown food';
          missingCodes.push(identifier);
          this.logger.warn(`Food "${identifier}" has no intake24 code, skipping`);
          continue;
        }

        // Skip and log foods with invalid nutrient table records
        const foodCompositionTable = record['food composition table']?.trim() || DEFAULT_FOOD_COMPOSITION_TABLE;
        const foodCompositionCode = record['food composition record id']?.trim() || DEFAULT_FOOD_COMPOSITION_TABLE_CODE;
        const nutrientTableId = `${foodCompositionTable}/${foodCompositionCode}`;

        try {
          // Try to validate the nutrient table record exists
          const response = await this.apiClient.nutrientTables.getRecord(foodCompositionTable, foodCompositionCode) as {
            data?: Array<{
              nutrientTableId: string;
              nutrientTableRecordId: string;
            }>;
          };

          if (!response?.data || response.data.length === 0) {
            const identifier = `${record['english description']?.trim()} (${record['intake24 code']})`;
            invalidNutrientRecords.push(`${identifier} - ${nutrientTableId}`);
            this.logger.warn(`Food "${identifier}" has invalid nutrient table record: ${nutrientTableId}, skipping`);
            continue;
          }
        }
        catch (err) {
          const identifier = `${record['english description']?.trim()} (${record['intake24 code']})`;
          invalidNutrientRecords.push(`${identifier} - ${nutrientTableId}`);
          this.logger.error(`Error checking nutrient table record for food "${identifier}": ${err instanceof Error ? err.message : 'Unknown error'}`);
          continue;
        }

        this.logger.debug('Raw PSM data from CSV:', record['portion size estimation methods']);
        const localPsm = this.fromCSVPortionSizeMethodPackage(
          record['portion size estimation methods'],
        );
        this.logger.debug('Processed PSM data:', localPsm);

        // Add PSM validation
        this.validatePsmFormat(record, localPsm);

        // Track foods with PSM issues
        if (record['portion size estimation methods']?.trim() && localPsm.length === 0) {
          const identifier = `${record['english description']} (${record['intake24 code']})`;
          this.logger.warn(`PSM parsing failed for food "${identifier}" with PSM data: ${record['portion size estimation methods']}`);
          psmValidationIssues.add(identifier);
        }

        // @ts-expect-error('Provided CSV doesn't always match the type defined')
        const localRegionDescription = record[`local description/${LANGUAGE_FLAG}`]?.trim();

        const localFood: PkgLocalFood = {
          version: randomUUID(),
          code: record['intake24 code'],
          localDescription:
            localRegionDescription
            || record['local description']?.trim()
            || record['english description'].trim(),
          nutrientTableCodes: this.determineNutrientTableCodes(
            record['food composition table'],
            record['food composition record id'],
          ),
          associatedFoods: await this.linkAssociatedFoodCategories(
            record['associated food or category'],
            LANGUAGE_FLAG,
            record['english description'].trim(),
            localRegionDescription,
          ),
          portionSize: localPsm,
          brandNames: [],
        };
        localFoodList.push(localFood);
        enabledLocalesFoodList.add(localFood.code);

        console.log({ localPsm });
      }
      catch (error) {
        // Enhanced error logging with food details
        const foodIdentifier = record['intake24 code']
          ? `${record['english description']?.trim()} (${record['intake24 code']})`
          : record['english description']?.trim() || 'Unknown food';

        if (error instanceof Error && error.message.includes('food_locals_food_code_fk')) {
          this.logger.error(`Foreign key constraint violation for food "${foodIdentifier}". This likely means the global food entry doesn't exist.`);
        }
        else {
          this.logger.error(`Error processing food "${foodIdentifier}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        throw error;
      }
    }

    this.localFoodList = localFoodList;
    this.enabledLocalesFoodList = Array.from(enabledLocalesFoodList);

    // Log missing codes to a file
    if (missingCodes.length > 0) {
      const logEntry = `${new Date().toISOString()}: Foods missing intake24 codes:\n${missingCodes.map(code => `- ${code}`).join('\n')}\n`;
      await fs.appendFile('missing-intake24-codes.log', logEntry);
    }

    // Log invalid nutrient records to a file
    if (invalidNutrientRecords.length > 0) {
      const logEntry = `${new Date().toISOString()}: Foods with invalid nutrient table records:\n${invalidNutrientRecords.map(record => `- ${record}`).join('\n')}\n`;
      await fs.appendFile('invalid-nutrient-records.log', logEntry);
    }

    // Log PSM validation issues to a file
    if (psmValidationIssues.size > 0) {
      const logEntry = `${new Date().toISOString()}: Foods with PSM parsing issues:\n${
        Array.from(psmValidationIssues).map(food => `- ${food}`).join('\n')
      }\n`;
      await fs.appendFile('psm-validation-issues.log', logEntry);
    }

    // Log summary of PSM validation
    this.logger.info(`PSM Validation Summary:`);
    this.logger.info(`- Total foods processed: ${data.length}`);
    this.logger.info(`- Foods with PSM issues: ${psmValidationIssues.size}`);
    this.logger.info(`- Unique PSM methods found: ${Array.from(allThePsmInTheImportCSV).join(', ')}`);

    await Promise.all([
      this.writeJSON(
        { [localeId]: this.localFoodList },
        path.join(this.outputFilePath, PkgConstants.LOCAL_FOODS_FILE_NAME),
      ),
      this.writeJSON(
        { [localeId]: this.enabledLocalesFoodList },
        path.join(this.outputFilePath, PkgConstants.ENABLED_LOCAL_FOODS_FILE_NAME),
      ),
    ]);
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

      // Load necessary data
      this.categoryPsm = await this.readCategoryPsm();
      const unprocessedRecords = await this.processCsvFile(options.importedFile);

      // Process data sequentially to ensure proper foreign key relationships
      this.logger.info('Creating global food list');
      await this.createGlobalFoodListAndWriteJSON(unprocessedRecords);

      this.logger.info('Creating local food list');
      await this.createLocalFoodListAndWriteJSON(unprocessedRecords, this.localeId);

      this.logger.info('Creating local category list');
      await this.createLocalCategoryListAndWriteJSON(this.localeId);

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
