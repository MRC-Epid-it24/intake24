import { log } from 'node:console';
import os from 'node:os';

import csv from 'csv-parser';
import { createReadStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { v4 as randomUUID } from 'uuid';

import type { ApiClientV4 } from '@intake24/api-client-v4';
import type logger from '@intake24/common-backend/services/logger/logger';

import type { PackageWriterOptions } from './package-writer';
import type {
  CsvColumnStructure,
  CsvFoodRecordUnprocessed,
  CSVHeaders,
  CsvResultStructure,
} from './types/csv-import';
import type { PkgAssociatedFood, PkgGlobalFood, PkgLocalFood } from './types/foods';
import { PkgConstants } from './constants';
import { CsvFoodRecords } from './types/csv-import';

export type Logger = typeof logger;

export const convertorTypeOptions = ['package', 'csv'] as const;

export interface ConvertorOptions {
  type: 'package' | 'csv';
}

const defaultOptions: ConvertorOptions = {
  type: 'csv',
};

const defaultJSONOptions: PackageWriterOptions = {
  jsonSpaces: 2,
  outputEncoding: 'utf-8',
};

export const csvHeaders = Object.values(CsvFoodRecords).map((record) => record.header);

// function UnionTypeToArray<T extends string>() {
//   return <U extends T[]>(...args: U & ([T] extends [U[number]] ? unknown : never)) => args;
// }

export class ConvertorToPackage {
  private readonly inputFilePath: string;
  private readonly outputFilePath: string;
  private readonly logger: Logger;
  private readonly options: ConvertorOptions;
  private csvStructure: typeof CsvFoodRecords | undefined;

  private globalFoodList: PkgGlobalFood[] = [];
  private localFoodList: PkgLocalFood[] = [];
  private enabledLocalesFoodList: string[] = [];

  constructor(
    inputFilePath: string,
    outputFilePath: string,
    logger: Logger,
    options: Partial<ConvertorOptions> = defaultOptions
  ) {
    this.inputFilePath = inputFilePath;
    this.outputFilePath = outputFilePath;
    this.logger = logger;
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  private async writeJSON(object: any, outputPath: string): Promise<void> {
    const dirName = path.dirname(outputPath);
    await fs.mkdir(dirName, { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(object, null, defaultJSONOptions.jsonSpaces), {
      encoding: defaultJSONOptions.outputEncoding,
    });
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
      .filter((record) => record.required === true)
      .map((record) => record.header);
    console.log('Required fields:', requiredFields);
    const transformedHeaders = headers.map((header) => header.toLowerCase());
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

  private linkAssociatedFoodCategories = (associatedFoodCategory: string): PkgAssociatedFood[] => {
    if (!associatedFoodCategory) return [];
    const associatedFoods: PkgAssociatedFood[] = [];
    associatedFoodCategory
      .split(',')
      .map((category) => category.trim())
      .map((category) => {
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
    for (const record of data) {
      if (record['action'] !== '5') continue;
      const parentCategories: string[] = record['categories']
        .split(',')
        .map((category) => category.trim());
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
              ? isNaN(parseInt(record['reasonable amount']))
                ? 0
                : parseInt(record['reasonable amount'])
              : 0,
          sameAsBeforeOption:
            record['same as before option'] && record['same as before option'] !== 'Inherited'
              ? record['same as before option'].toLowerCase() === 'true'
              : false,
        },
        parentCategories: parentCategories || [],
      };
      globalFoodList.push(globalFood);
    }
    this.globalFoodList = globalFoodList;

    await this.writeJSON(
      this.globalFoodList,
      path.join(this.outputFilePath, PkgConstants.GLOBAL_FOODS_FILE_NAME)
    );
  }

  private async createLocalFoodListAndWriteJSON(data: CsvFoodRecordUnprocessed[]) {
    const localFoodList: PkgLocalFood[] = [];
    const enabledLocalesFoodList: string[] = [];
    for (const record of data) {
      const localFood: PkgLocalFood = {
        version: randomUUID(),
        code: record['intake24 code'],
        localDescription: record['local description'],
        nutrientTableCodes: {
          [record['food composition table']]: record['food composition table record id'],
        },
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
      this.localFoodList,
      path.join(this.outputFilePath, PkgConstants.LOCAL_FOODS_FILE_NAME)
    );

    await this.writeJSON(
      this.enabledLocalesFoodList,
      path.join(this.outputFilePath, 'enabled-locales-food.json')
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
          headers = headers.map((header) => header.toLowerCase());
          headersValidated = this.validateCsvStructure(headers);
          requiredHeadersValidated = this.validateRequiredFieldsExist(headers);
          if (!headersValidated || !requiredHeadersValidated) {
            reject(
              new Error(
                'CSV file does not contain the required structure defined in the JSON file.'
              )
            );
            return;
          }
        })
        .on('data', (data: CsvFoodRecordUnprocessed) => {
          if (!headersValidated || !requiredHeadersValidated) {
            this.logger.debug(`Headers didn't pass validation - ${headersValidated}`);
            return new Error('Headers not validated or not all required fields exist.');
          }
          const lowercaseData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key.toLowerCase(), value])
          ) as CsvFoodRecordUnprocessed;
          results.push(lowercaseData);
        })
        .on('end', () => {
          if (headersValidated) {
            resolve(results);
          }
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
      // 2. Convert to the LocalFood JSON structure
      await this.createLocalFoodListAndWriteJSON(uproccessedRecords);
      // 3. Convert to the EnabledLocalesFood JSON structure
      // this.createEnabledLocalesFoodList(data);
      // 4. Convert to the PortionSizeMethod JSON structure
      // TODO: Add the rest of the structures
    } catch (error) {
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
    } else {
      this.logger.debug('Converting to package from unspecified file type');
      throw new Error('Unsupported file type');
    }
  }
}
