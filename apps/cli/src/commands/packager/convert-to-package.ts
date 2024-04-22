import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import csv from 'csv-parser';
import { v4 as randomUUID } from 'uuid';

import type logger from '@intake24/common-backend/services/logger/logger';

import type { PackageWriterOptions } from './package-writer';
import type {
  CsvFoodRecordUnprocessed,
  CSVHeaders,
  CsvResultStructure,
} from './types/csv-import';
import type { PkgAssociatedFood, PkgGlobalFood, PkgLocalFood } from './types/foods';
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

export const csvHeaders = Object.values(CsvFoodRecords).map(record => record.header);

// function UnionTypeToArray<T extends string>() {
//   return <U extends T[]>(...args: U & ([T] extends [U[number]] ? unknown : never)) => args;
// }

export class ConvertorToPackage {
  private readonly inputFilePath: string;
  private inputDirPath: string | undefined;
  private readonly outputFilePath: string;
  private readonly logger: Logger;
  private readonly options: ConvertorOptions;
  private csvStructure: typeof CsvFoodRecords | undefined;
  private exisingCategories: string[] | undefined;

  private locales: PkgLocale[] | undefined = [];
  private localeId: string | null = null;
  private globalFoodList: PkgGlobalFood[] = [];
  private localFoodList: PkgLocalFood[] = [];
  private enabledLocalesFoodList: string[] = [];
  private skipMissingCategories: boolean;

  constructor(
    inputFilePath: string,
    outputFilePath: string,
    logger: Logger,
    options: Partial<ConvertorOptions> = defaultOptions,
  ) {
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
    catch (e) {
      this.logger.debug(`File ${filePath} does not exist or is not accessible, skipping`);
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
    return existingCategories.map(category => category.code); ;
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
          promptText: '',
          genericName: '',
        });
      });

    return associatedFoods;
  };

  private async createGlobalFoodListAndWriteJSON(data: CsvFoodRecordUnprocessed[]) {
    const globalFoodList: PkgGlobalFood[] = [];
    this.exisingCategories = await this.readExistingCategories();
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
        parentCategories: parentCategoriesUnique || [],
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
      const localFood: PkgLocalFood = {
        version: randomUUID(),
        code: record['intake24 code'],
        localDescription: record['local description'],
        nutrientTableCodes: this.determineNutrientTableCodes(
          record['food composition table'],
          record['food composition table record id'],
        ),
        associatedFoods: this.linkAssociatedFoodCategories(record['associated food or category']),
        portionSize: [],
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
      const uproccessedRecords = await this.processCsvFile(options.importedFile);
      // 1. Convert to the GlobalFood JSON structure
      await this.createGlobalFoodListAndWriteJSON(uproccessedRecords);
      // 2.1. Make sure that locale is loaded
      this.localeId = await this.readLocaleId();
      if (!this.localeId) {
        this.logger.error('No locale found, exiting');
        return undefined;
      }
      // 2.2. Convert to the LocalFood JSON structure
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

      // await this.convertFromCsv();
      await this.processCSVImport({
        structure: this.csvStructure,
        importedFile: this.inputFilePath,
      });
    }
    else {
      this.logger.debug('Converting to package from unspecified file type');
      throw new Error('Unsupported file type');
    }
  }
}
