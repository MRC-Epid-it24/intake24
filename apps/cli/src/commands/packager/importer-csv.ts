import { log } from 'node:console';
import os from 'node:os';

import csv from 'csv-parser';
import { createReadStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import type { ApiClientV4 } from '@intake24/api-client-v4';
import logger from '@intake24/common-backend/services/logger/logger';

import type { CsvColumnStructure, CsvResultStructure } from './types/csv-import';

// Read and parse the JSON structure file
// const readStructureFile = async (filePath: string): Promise<CsvColumnStructure | undefined> => {
//   try {
//     await fs.access(filePath);
//   } catch (e) {
//     logger.debug(`File ${filePath} does not exist or is not accessible, skipping`);
//     return undefined;
//   }
//   const structure = await fs.readFile(filePath, 'utf-8');
//   return JSON.parse(structure);
// };

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
