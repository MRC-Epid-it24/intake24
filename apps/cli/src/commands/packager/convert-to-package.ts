import { randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import csv from 'csv-parser';

import type logger from '@intake24/common-backend/services/logger/logger';
import { ApiClientV4 } from '@intake24/api-client-v4';
import { CategoryContents, CategoryHeader } from '@intake24/common/types/http';

import type { PackageWriterOptions } from './package-writer';
import type {
  CsvFoodRecordUnprocessed,
  CSVHeaders,
  CsvResultStructure,
  DefaultPSMCategory,
} from './types/csv-import';
import type { PkgAssociatedFood, PkgGlobalFood, PkgLocalFood, PkgPortionSizeMethod, PkgStandardUnit } from './types/foods';
import { PkgConstants } from './constants';
import { CsvFoodRecords } from './types/csv-import';
import { PkgLocale } from './types/locale';

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

const defaultJSONOptions: PackageWriterOptions = {
  jsonSpaces: 2,
  outputEncoding: 'utf-8',
};

const DEFAULT_FOOD_COMPOSITION_TABLE = process.env.CSV_DEFAULT_FOOD_COMPOSION_TABLE || 'NDNS';
const DEFAULT_FOOD_COMPOSITION_TABLE_CODE = process.env.CSV_DEFAULT_FOOD_COMPOSITION_CODE || '01B10311';
const DEFAULT_SKIP_MISSING_CATEGORIES = process.env.DEFAULT_SKIP_MISSING_CATEGORIES === 'true' || false;

const allThePsmInTheImportCSV = new Set<string>([]);

export const csvHeaders = Object.values(CsvFoodRecords).map(record => record.header);

export class ConvertorToPackage {
  private readonly inputFilePath: string;
  private inputDirPath: string | undefined;
  private readonly outputFilePath: string;
  private readonly logger: Logger;
  private readonly options: ConvertorOptions;
  private csvStructure: typeof CsvFoodRecords | undefined;
  private exisingCategories: string[] | undefined;

  private locales: PkgLocale[] | undefined = [];
  private categoryPsm: DefaultPSMCategory[] | undefined;
  private localeId: string | null = null;
  private globalFoodList: PkgGlobalFood[] = [];
  private localFoodList: PkgLocalFood[] = [];
  private enabledLocalesFoodList: string[] = [];
  private skipMissingCategories: boolean;

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
    this.exisingCategories = undefined;
    this.skipMissingCategories = DEFAULT_SKIP_MISSING_CATEGORIES;
  }

  private async writeJSON(object: any, outputPath: string): Promise<void> {
    const dirName = path.dirname(outputPath);
    await fs.mkdir(dirName, { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(object, null, defaultJSONOptions.jsonSpaces), {
      encoding: defaultJSONOptions.outputEncoding,
    });
  }

  private async readJSON<T>(relativePath: string): Promise<T | undefined> {
    const filePath = path.join(this.inputDirPath!, relativePath);
    this.logger.debug(`Reading JSON file: ${filePath}`);

    try {
      await fs.access(filePath);
    }
    catch (e: unknown) {
      this.logger.debug(`File ${filePath} does not exist or is not accessible, skipping\n ${e}`);
      return undefined;
    }

    return JSON.parse(await fs.readFile(filePath, 'utf-8')) as T;
  }

  private async readLocaleId(): Promise<string | null> {
    this.logger.info('Loading locales');
    this.locales = await this.readJSON(PkgConstants.LOCALES_FILE_NAME);
    if (this.locales !== undefined) {
      this.logger.debug(`Loaded ${this.locales[0].id} locale`);
      return this.locales[0].id;
    }
    else {
      this.logger.debug('No locales found');
      return null;
    }
  }

  private async readCategoryPsm(): Promise<DefaultPSMCategory[] | undefined> {
    this.logger.info('Loading category PSM');
    const categoryPsmJSON = await this.readJSON<DefaultPSMCategory[]>(PkgConstants.CATEGORY_PSM_FILE_NAME);
    if (categoryPsmJSON !== undefined && categoryPsmJSON !== null) {
      this.logger.debug('Loaded category PSM');
      return categoryPsmJSON;
    }
    else {
      this.logger.debug('No category PSMs found');
      return undefined;
    }
  }

  // Validate CSV structure against JSON structure (TODO: move to the DB service)
  private validateCsvStructure = (headers: string[]): boolean => {
    this.logger.debug('Validating CSV structure');
    // Check if all headers are of the correct type CSVHeaders
    const headersValidated = headers.every((header) => {
      return Object.values(csvHeaders).includes(header.toLowerCase() as CSVHeaders);
    });

    return headersValidated;
  };

  private validateRequiredFieldsExist = (headers: string[]): boolean => {
    this.logger.debug('Validating required fields');
    const requiredFields = Object.values(CsvFoodRecords)
      .filter(record => record.required === true)
      .map(record => record.header);
    console.log('Required fields:', requiredFields);
    const transformedHeaders = headers.map(header => header.toLowerCase());
    this.logger.debug(`Transformed headers: ${transformedHeaders}`);
    const requiredFieldsValidated = requiredFields.every((field) => {
      this.logger.debug(`Checking for field: ${field} - ${transformedHeaders.includes(field)}`);
      return transformedHeaders.includes(field);
    });
    this.logger.debug(`Required fields validated: ${requiredFieldsValidated}`);
    return requiredFieldsValidated;
  };

  private async readCSVStructure(): Promise<void> {
    this.logger.info('Loading CSV structure');
    this.csvStructure = await CsvFoodRecords;
  }

  private async readExistingCategories(): Promise<string[]> {
    const existingCategories = await this.readJSON<existingCategories[]>(PkgConstants.CSV_EXISTING_CATEGORIES_FILE_NAME);
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

  private determineNutrientTableCodes = (foodCompositionTable: string, foodCompositionTableCode: string): Record<string, string> => {
    foodCompositionTable = foodCompositionTable.length > 0 ? foodCompositionTable : DEFAULT_FOOD_COMPOSITION_TABLE;
    foodCompositionTableCode = foodCompositionTableCode.length > 0 ? foodCompositionTableCode : DEFAULT_FOOD_COMPOSITION_TABLE_CODE;
    return {
      [foodCompositionTable.trim()]: foodCompositionTableCode,
    };
  };

  // validate the categories in the CSV file against the existing categories
  private determineIfGlobalCategoriesExist = async (categories: string, exisingCategories: string[]): Promise<string[]> => {
    this.logger.debug('Validating categories');
    const missingCategories: string[] = [];

    if (this.exisingCategories === undefined)
      return [];
    const categoriesForCheck = categories
      .split(',')
      .map(category => category.trim());

    categoriesForCheck.forEach((category) => {
      if (!exisingCategories.includes(category))
        missingCategories.push(category);
    });

    return missingCategories;
  };

  // Create a Map of the existing categories leaf - key, all parent categories - value
  private determineCategoriesHierarchy = async (level: number, category: CategoryHeader, parentCategories: string[] = []): Promise<Map<string, string[]>> => {
    const categoriesHierarchy: Map<string, string[]> = new Map();
    categoriesHierarchy.set(`${category.code}:_${Math.round(Math.random() * 1000)}`, parentCategories);

    const contents = await this.apiClient.categories.getCategoryContents(
      category.code,
      this.localeId ?? '',
    );

    if (contents.subcategories.length === 0)
      return categoriesHierarchy;
    for (const subheader of contents.subcategories) {
      const categoryPath = await this.determineCategoriesHierarchy(level + 1, subheader, [...parentCategories, category.code]);
      categoryPath.forEach((value, key) => {
        categoriesHierarchy.set(key, value);
      });
    }
    return categoriesHierarchy;
  };

  private mapCategoryHierarchy = async (categories: CategoryContents): Promise<Map<string, string[]>> => {
    const categoriesHierarchy: Map<string, string[]> = new Map();
    for (const category of categories.subcategories) {
      const categoryPath = await this.determineCategoriesHierarchy(1, category, []);
      categoryPath.forEach((value, key) => {
        categoriesHierarchy.set(key, value);
      });
    }
    return categoriesHierarchy;
  };

  private linkAssociatedFoodCategories = (associatedFoodCategory: string): PkgAssociatedFood[] => {
    if (!associatedFoodCategory)
      return [];
    const associatedFoods: PkgAssociatedFood[] = [];
    associatedFoodCategory
      .split(',')
      .map(category => category.trim())
      .forEach((category) => {
        associatedFoods.push({
          foodCode: category,
          linkAsMain: false,
          promptText: { en: '' },
          genericName: { en: '' },
        });
      });

    return associatedFoods;
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

  private fromCSVPortionSizeMethodPackage = (psm: string): PkgPortionSizeMethod[] => {
    this.logger.debug(`Processing PSM - ${psm}`);
    const psmToUse = psm;
    // TODO: Check if the parent categories have a default PSM
    // const psmToUse = psm.length > 0 ? psm : this.checkForCategoryDefaultPsm(parentCategories);

    if (!psmToUse || psmToUse.length === 0)
      return [];
    const normalizedPsm: PkgPortionSizeMethod[] = [];
    const lines = psm
      .split('\n')
      .map(method => method.trim());
    lines.forEach((line) => {
      const keyValuePairs = line.split(',').map(pair => pair.trim().split(': '));
      const method = keyValuePairs.find(pair => pair[0] === 'Method')?.[1];
      const useForRecipes = keyValuePairs.find(pair => pair[0] === 'use for recipes')?.[1];
      const conversionFactor = keyValuePairs.find(pair => pair[0] === 'conversion')?.[1];
      const servingImageSet = keyValuePairs.find(pair => pair[0] === 'serving-image-set')?.[1];
      const leftoversImageSet = keyValuePairs.find(pair => pair[0] === 'leftovers-image-set')?.[1];
      this.logger.info(`Method: ${method}, useForRecipes: ${useForRecipes}, conversionFactor: ${conversionFactor}`);

      allThePsmInTheImportCSV.add(method!);
      switch (method) {
        case 'as-served':
          normalizedPsm.push({
            method: 'as-served',
            description: 'use_an_image',
            conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
            leftoversImageSet: leftoversImageSet ?? '',
            useForRecipes: useForRecipes === 'true',
            servingImageSet: servingImageSet ?? '',
          });
          break;
        case 'guide-image':
          normalizedPsm.push({
            method: 'guide-image',
            description: 'use_a_guided__image',
            conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
            guideImageId: keyValuePairs.find(pair => pair[0] === 'guide-image-id')?.[1] ?? '',
            useForRecipes: useForRecipes === 'true',
          });
          break;
        case 'drink-scale':
          normalizedPsm.push({
            method: 'drink-scale',
            description: 'use_a_drinware_image',
            conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
            drinkwareId: keyValuePairs.find(pair => pair[0] === 'drinkware-id')?.[1] ?? '',
            initialFillLevel: Number.parseFloat(keyValuePairs.find(pair => pair[0] === 'initial-fill-level')?.[1] ?? '0.9'),
            skipFillLevel: keyValuePairs.find(pair => pair[0] === 'skip-fill-level')?.[1] === 'true',
            useForRecipes: useForRecipes === 'true',
          });
          break;
        case 'standard-portion': {
          const unitCount = Number.parseInt(keyValuePairs.find(pair => pair[0] === 'units-count')?.[1] ?? '0');
          const units: PkgStandardUnit[] = [];
          if (unitCount) {
            for (let i = 0; i < unitCount; i++) {
              const name = keyValuePairs.find(pair => pair[0] === `unit${i}-name`)?.[1];
              const weight = keyValuePairs.find(pair => pair[0] === `unit${i}-weight`)?.[1];
              const omitFoodDescription = keyValuePairs.find(pair => pair[0] === `unit${i}-omit-food-description`)?.[1] === 'true';
              units.push({
                name: name ?? '',
                weight: Number.parseFloat(weight ?? '0'),
                omitFoodDescription,
                inlineEstimateIn: '',
                inlineHowMany: '',
              });
            }
          }

          normalizedPsm.push({
            method: 'standard-portion',
            description: 'use_a_standard_portion',
            conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
            units,
            useForRecipes: useForRecipes === 'true',
          });
        }
          break;
        case 'cereal':
          normalizedPsm.push({
            method: 'cereal',
            description: 'use_a_cereal_portion',
            conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
            type: keyValuePairs.find(pair => pair[0] === 'cereal-type')?.[1] ?? '',
            useForRecipes: useForRecipes === 'true',
          });
          break;
        case 'pizza':
          normalizedPsm.push({
            method: 'pizza',
            description: 'use_a_pizza_portion',
            conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
            useForRecipes: useForRecipes === 'true',
          });
          break;
        case 'milk-on-cereal':
          normalizedPsm.push({
            method: 'milk-on-cereal',
            description: 'use_a_milk_on_cereal_portion',
            conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
            useForRecipes: useForRecipes === 'true',
          });
          break;
        case 'milk-in-a-hot-drink':
          normalizedPsm.push({
            method: 'milk-in-a-hot-drink',
            description: 'use_a_milk_in_a_hot_drink_portion',
            conversionFactor: conversionFactor ? Number.parseFloat(conversionFactor) : 1,
            useForRecipes: useForRecipes === 'true',
          });
          break;
        default:
          break;
      }
    });
    return normalizedPsm;
  };

  private async createGlobalFoodListAndWriteJSON(data: CsvFoodRecordUnprocessed[]) {
    const globalFoodList: PkgGlobalFood[] = [];

    this.exisingCategories = await this.readExistingCategories();
    // if existing categories file doesn't exisit or is empty, access V4 Api to get all categories
    if (!this.exisingCategories) {
      this.logger.debug('No existing categories found, fetching from V4 API');
      this.exisingCategories = (await this.apiClient.categories.getAllCategories()).map(category => category.code);
    }

    // Get the root categories for the locale
    const localeRootCategories = await this.apiClient.categories.getRootCategories(this.localeId ?? '');
    // Create a Map of the existing categories leaf - key, all parent categories - value
    const localeCategoriesHierarchy: Map<string, string[]> = await this.mapCategoryHierarchy(localeRootCategories);

    this.logger.info('Creating global food list');

    for (const record of data) {
      if (record.action !== '5')
        continue;
      let parentCategoriesUnique: string[] = [...new Set(record.categories
        .split(',')
        .map(category => category.trim()))];
      const missingCategories = await this.determineIfGlobalCategoriesExist(record.categories, this.exisingCategories);
      if (!this.skipMissingCategories && missingCategories.length > 0) {
        this.logger.error(`Categories ${missingCategories} for food ${record['intake24 code']} do not exist in the existing categories list. ERROR`);
      }
      else if (this.skipMissingCategories && missingCategories.length > 0) {
        this.logger.warn(`Categories ${missingCategories} for food ${record['intake24 code']} do not exist in the existing categories list. SKIPPING`);
        parentCategoriesUnique = parentCategoriesUnique.filter(category => !missingCategories.includes(category));
      }

      // Filter out the categories that are parents of the other existing categories in the parentCategoriesUnique array
      // based on the locale categories hierarchy
      // reverse the array to start from the leaf categories
      const parentCategoriesUniqueReversed = [...parentCategoriesUnique].reverse();
      const parentCategoriesFiltered: string[] = parentCategoriesUniqueReversed.reduce((filtered, category) => {
        const regex = new RegExp(`^${category}:_`);
        const matchingKeys = Array.from(localeCategoriesHierarchy.keys()).filter(key => regex.test(key));

        // create a new set with all the parents categories from the matching keys
        const matchedParentCategories = [...new Set(matchingKeys.map(key => localeCategoriesHierarchy.get(key)).flat())].filter(cat => cat !== undefined) as string[];

        // add matched parent categories to the filtered array
        return matchedParentCategories.length > 0 ? [...filtered, ...matchedParentCategories] : filtered;
      }, [] as string[]);

      const cleanedParentCategories = [...parentCategoriesUnique].filter(category => ![...parentCategoriesFiltered].includes(category));

      const globalFood: PkgGlobalFood = {
        version: randomUUID(),
        code: record['intake24 code'],
        englishDescription: record['english description'],
        groupCode: 1,
        attributes: {
          useInRecipes:
            record['use in recipes'] && record['use in recipes'] !== 'Inherited'
              ? this.determineRecipeUse(record['use in recipes'])
              : 0,
          readyMealOption:
            record['ready meal option'] && record['ready meal option'] !== 'Inherited'
              ? record['ready meal option'].toLowerCase() === 'true'
              : false,
          reasonableAmount:
            record['reasonable amount'] && record['reasonable amount'] !== 'Inherited'
              ? Number.isNaN(Number.parseInt(record['reasonable amount']))
                ? 0
                : Number.parseInt(record['reasonable amount'])
              : 0,
          sameAsBeforeOption:
            record['same as before option'] && record['same as before option'] !== 'Inherited'
              ? record['same as before option'].toLowerCase() === 'true'
              : false,
        },
        parentCategories: cleanedParentCategories || [],
      };
      globalFoodList.push(globalFood);
    }
    this.globalFoodList = globalFoodList;

    await this.writeJSON(
      this.globalFoodList,
      path.join(this.outputFilePath, PkgConstants.GLOBAL_FOODS_FILE_NAME),
    );
  }

  private async createLocalFoodListAndWriteJSON(data: CsvFoodRecordUnprocessed[], localeId: string) {
    const localFoodList: PkgLocalFood[] = [];
    const enabledLocalesFoodList: string[] = [];
    for (const record of data) {
      this.logger.info(`Processing local food ${record['intake24 code']}`);
      const localPsm = this.fromCSVPortionSizeMethodPackage(record['portion size estimation methods']);
      this.logger.info(`Local PSM for food ${record['intake24 code']}: ${localPsm.map(psm => psm.method).join(', ')}`);
      const localFood: PkgLocalFood = {
        version: randomUUID(),
        code: record['intake24 code'],
        localDescription: record['local description'],
        nutrientTableCodes: this.determineNutrientTableCodes(
          record['food composition table'],
          record['food composition table record id'],
        ),
        associatedFoods: this.linkAssociatedFoodCategories(record['associated food or category']),
        portionSize: localPsm,
        brandNames: [],
      };
      localFoodList.push(localFood);
      enabledLocalesFoodList.push(localFood.code);
    }
    this.localFoodList = localFoodList;
    this.enabledLocalesFoodList = enabledLocalesFoodList;

    await this.writeJSON(
      { [localeId]: this.localFoodList },
      path.join(this.outputFilePath, PkgConstants.LOCAL_FOODS_FILE_NAME),
    );

    if (this.enabledLocalesFoodList.length !== new Set(this.enabledLocalesFoodList).size)
      this.logger.error('Duplicate food codes found in the enabled local foods list');

    await this.writeJSON(
      { [localeId]: this.enabledLocalesFoodList },
      path.join(this.outputFilePath, PkgConstants.ENABLED_LOCAL_FOODS_FILE_NAME),
    );
  }

  // Process the CSV file, while ensuring headers are validated before processing data
  private processCsvFile = async (csvFilePath: string): Promise<CsvFoodRecordUnprocessed[]> => {
    let headersValidated = false; // Flag to ensure headers are validated
    let requiredHeadersValidated = false; // Flag to ensure required headers are validated
    const results: CsvFoodRecordUnprocessed[] = [];

    return new Promise<CsvFoodRecordUnprocessed[]>((resolve, reject) => {
      createReadStream(csvFilePath)
        .pipe(csv({}))
        .on('headers', (headers: string[]) => {
          headers = headers.map(header => header.toLowerCase());
          headersValidated = this.validateCsvStructure(headers);
          requiredHeadersValidated = this.validateRequiredFieldsExist(headers);
          if (!headersValidated || !requiredHeadersValidated) {
            reject(
              new Error(
                'CSV file does not contain the required structure defined in the JSON file.',
              ),
            );
          }
        })
        .on('data', (data: CsvFoodRecordUnprocessed) => {
          if (!headersValidated || !requiredHeadersValidated) {
            this.logger.debug(`Headers didn't pass validation - ${headersValidated}`);
            return new Error('Headers not validated or not all required fields exist.');
          }
          const lowercaseData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key.toLowerCase(), value]),
          ) as CsvFoodRecordUnprocessed;
          results.push(lowercaseData);
        })
        .on('end', () => {
          if (headersValidated)
            resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  };

  // Main function to initiate the CSV importer
  private processCSVImport = async (options: {
    structure: typeof CsvFoodRecords | undefined;
    importedFile: string;
  }): Promise<CsvResultStructure[] | undefined> => {
    try {
      if (!options.structure) {
        this.logger.debug('No structure file found, skipping CSV import');
        return undefined;
      }
      // 0. Make sure that locale is loaded
      this.localeId = await this.readLocaleId();
      if (!this.localeId) {
        this.logger.error('No locale found, exiting');
        throw new Error('No locale found');
      }
      // this.categoryPsm = await this.readCategoryPsm();
      const uproccessedRecords = await this.processCsvFile(options.importedFile);

      // 1. Convert to the GlobalFood JSON structure
      await this.createGlobalFoodListAndWriteJSON(uproccessedRecords);

      // 2. Convert to the LocalFood JSON structure
      await this.createLocalFoodListAndWriteJSON(uproccessedRecords, this.localeId);

      // 3. Convert to the EnabledLocalesFood JSON structure
      // this.createEnabledLocalesFoodList(data);

      // 4. Convert to the PortionSizeMethod JSON structure
      // TODO: Add the rest of the structures
    }
    catch (error) {
      console.error('Error processing files:', error);
    }
  };

  async convert() {
    this.logger.debug('Converting to package');
    const fileExtension = path.extname(this.inputFilePath);
    if (fileExtension === '.csv') {
      this.logger.debug('Converting to package from CSV');

      await this.readCSVStructure();

      await this.processCSVImport({
        structure: this.csvStructure,
        importedFile: this.inputFilePath,
      });
    }
    else {
      this.logger.debug('Converting to package from unspecified file type');
      throw new Error('Unsupported file type');
    }

    this.logger.info('Conversion complete');
    this.logger.info(`This are the PSMs in the CSV file: ${Array.from(allThePsmInTheImportCSV).join(', ')}`);
  }
}
