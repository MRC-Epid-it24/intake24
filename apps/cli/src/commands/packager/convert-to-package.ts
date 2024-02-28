import { log } from 'node:console';
import os from 'node:os';

import csv from 'csv-parser';
import { createReadStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import type { ApiClientV4 } from '@intake24/api-client-v4';
import logger from '@intake24/common-backend/services/logger/logger';

import type { CsvColumnStructure, CsvResultStructure } from './types/csv-import';

export type Logger = typeof logger;

export const convertorTypeOptions = ['package', 'csv'] as const;

export interface ConvertorOptions {
  type: 'package' | 'csv';
}

const defaultOptions: ConvertorOptions = {
  type: 'csv',
};

export class ConvertorToPackage {
  private readonly inputFilePath: string;
  private readonly outputFilePath: string;
  private readonly logger: Logger;
  private readonly options: ConvertorOptions;

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

  async convert() {
    this.logger.debug('Converting to package');
    const fileExtension = path.extname(this.inputFilePath);
    if (fileExtension === '.csv') {
      this.logger.debug('Converting to package from CSV');

      // await this.convertFromCsv();
    } else {
      this.logger.debug('Converting to package from unspecified file type');
      throw new Error('Unsupported file type');
    }
  }
}

// Validate CSV structure against JSON structure (TODO: move to the DB service)
const validateCsvStructure = (headers: string[], structure: CsvColumnStructure): boolean => {
  const structureKeys = Object.keys(structure);
  return structureKeys.every((key) => headers.includes(key));
};

// Process the CSV file, while ensuring headers are validated before processing data
const processCsvFile = async (
  csvFilePath: string,
  structure: CsvColumnStructure
): Promise<CsvResultStructure[]> => {
  let headersValidated = false; // Flag to ensure headers are validated
  const results: CsvResultStructure[] = [];

  return new Promise<CsvResultStructure[]>((resolve, reject) => {
    createReadStream(csvFilePath)
      .pipe(csv())
      .on('headers', (headers: string[]) => {
        if (!validateCsvStructure(headers, structure)) {
          reject(
            new Error('CSV file does not contain the required structure defined in the JSON file.')
          );
          return;
        }
        headersValidated = true;
      })
      .on('data', (data) => {
        if (!headersValidated) {
          logger.debug(`Headers validated to be ${headersValidated}`);
          return new Error('Headers not validated');
        }
        const record: { [key: string]: any } = {};
        for (const key in structure) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            record[key] = data[key];
          }
        }
        results.push(record);
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
export const processCSVImport = async (options: {
  structure: CsvColumnStructure | undefined;
  importedFile: string;
}): Promise<CsvResultStructure[] | undefined> => {
  try {
    if (!options.structure) {
      logger.debug('No structure file found, skipping CSV import');
      return undefined;
    }
    return await processCsvFile(options.importedFile, options.structure);
  } catch (error) {
    console.error('Error processing files:', error);
  }
};
