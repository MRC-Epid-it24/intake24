import { createReadStream, readFileSync } from 'node:fs';
import { parse as parseStream } from 'csv-parse';
import { parse } from 'csv-parse/sync';

export interface CsvReaderOptions {
  delimiter?: string;
  quote?: string;
  escape?: string;
  skipEmptyLines?: boolean;
  skipLinesWithError?: boolean;
  columns?: boolean | string[];
  fromLine?: number;
  toLine?: number;
  encoding?: BufferEncoding;
}

export interface CsvStreamOptions extends CsvReaderOptions {
  batchSize?: number;
  onBatch?: (batch: any[], batchIndex: number) => void;
  onRow?: (row: any[], rowIndex: number) => void;
  onError?: (error: Error, rowIndex: number) => void;
}

export class CsvReader {
  private defaultOptions: CsvReaderOptions = {
    delimiter: ',',
    quote: '"',
    escape: '"',
    skipEmptyLines: true,
    skipLinesWithError: false,
    columns: true,
    encoding: 'utf8',
  };

  /**
   * Read entire CSV file into memory
   */
  readFile(filePath: string, options: CsvReaderOptions = {}): any[] {
    const mergedOptions = { ...this.defaultOptions, ...options };

    try {
      const fileContent = readFileSync(filePath, { encoding: mergedOptions.encoding });
      return parse(fileContent, mergedOptions);
    }
    catch (error) {
      throw new Error(`Failed to read CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Read CSV file with streaming for large files
   */
  async readFileStream(filePath: string, options: CsvStreamOptions = {}): Promise<void> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const { batchSize = 1000, onBatch, onRow, onError } = options;

    return new Promise((resolve, reject) => {
      const stream = createReadStream(filePath, { encoding: mergedOptions.encoding });
      const parser = parseStream(mergedOptions);

      let batch: any[] = [];
      let rowIndex = 0;
      let batchIndex = 0;
      let hasError = false;

      parser.on('readable', () => {
        while (true) {
          const record = parser.read();
          if (record === null)
            break;
          if (onRow) {
            try {
              onRow(record, rowIndex);
            }
            catch (error) {
              if (onError) {
                onError(error as Error, rowIndex);
              }
              else {
                hasError = true;
                reject(error);
                return;
              }
            }
          }

          if (onBatch) {
            batch.push(record);
            if (batch.length >= batchSize) {
              try {
                onBatch([...batch], batchIndex);
                batch = [];
                batchIndex++;
              }
              catch (error) {
                if (onError) {
                  onError(error as Error, rowIndex);
                }
                else {
                  hasError = true;
                  reject(error);
                  return;
                }
              }
            }
          }

          rowIndex++;
        }
      });

      parser.on('error', (error) => {
        if (onError) {
          onError(error, rowIndex);
        }
        else {
          hasError = true;
          reject(error);
        }
      });

      parser.on('end', () => {
        // Process remaining batch
        if (onBatch && batch.length > 0) {
          try {
            onBatch(batch, batchIndex);
          }
          catch (error) {
            if (onError) {
              onError(error as Error, rowIndex);
            }
            else if (!hasError) {
              reject(error);
              return;
            }
          }
        }

        if (!hasError) {
          resolve();
        }
      });

      stream.pipe(parser);
    });
  }

  /**
   * Get basic file information without loading the entire file
   */
  async getFileInfo(filePath: string, options: CsvReaderOptions = {}): Promise<{
    totalRows: number;
    columns: string[];
    sampleRows: any[];
  }> {
    const mergedOptions = { ...this.defaultOptions, ...options };

    return new Promise((resolve, reject) => {
      const stream = createReadStream(filePath, { encoding: mergedOptions.encoding });
      const parser = parseStream(mergedOptions);

      let totalRows = 0;
      let columns: string[] = [];
      const sampleRows: any[] = [];
      const maxSampleRows = 5;

      parser.on('readable', () => {
        while (true) {
          const record = parser.read();
          if (record === null)
            break;
          if (totalRows === 0 && mergedOptions.columns === true) {
            // If columns is true, first row becomes column names
            columns = Object.keys(record);
          }
          else if (totalRows === 0 && Array.isArray(mergedOptions.columns)) {
            columns = mergedOptions.columns;
          }
          else if (totalRows === 0) {
            // No column headers, use indices
            columns = Object.keys(record);
          }

          if (sampleRows.length < maxSampleRows) {
            sampleRows.push(record);
          }

          totalRows++;
        }
      });

      parser.on('error', reject);
      parser.on('end', () => {
        resolve({
          totalRows,
          columns,
          sampleRows,
        });
      });

      stream.pipe(parser);
    });
  }

  /**
   * Convert CSV data to array format (for compatibility with existing validation)
   */
  toArrayFormat(data: any[]): any[][] {
    if (!data || data.length === 0) {
      return [];
    }

    // If data is already in array format, return as-is
    if (Array.isArray(data[0])) {
      return data;
    }

    // Convert object format to array format
    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    return data.map(row => columns.map(col => row[col]));
  }

  /**
   * Validate CSV file structure
   */
  async validateCsvStructure(filePath: string, options: CsvReaderOptions = {}): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    info: any;
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const info = await this.getFileInfo(filePath, options);

      // Check if file has data
      if (info.totalRows === 0) {
        errors.push('CSV file is empty');
      }

      // Check if columns are consistent
      if (info.columns.length === 0) {
        errors.push('No columns detected in CSV file');
      }

      // Check sample rows for consistency
      const expectedColumnCount = info.columns.length;
      info.sampleRows.forEach((row, index) => {
        const actualColumnCount = Array.isArray(row) ? row.length : Object.keys(row).length;
        if (actualColumnCount !== expectedColumnCount) {
          warnings.push(`Row ${index + 1} has ${actualColumnCount} columns, expected ${expectedColumnCount}`);
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        info,
      };
    }
    catch (error) {
      errors.push(`Failed to validate CSV structure: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        isValid: false,
        errors,
        warnings,
        info: null,
      };
    }
  }
}

// Utility functions for CSV processing
export const csvUtils = {
  /**
   * Quick read CSV file
   */
  readCsv: (filePath: string, options?: CsvReaderOptions) => {
    const reader = new CsvReader();
    return reader.readFile(filePath, options);
  },

  /**
   * Convert CSV to array format for validation
   */
  toArrays: (data: any[]) => {
    const reader = new CsvReader();
    return reader.toArrayFormat(data);
  },

  /**
   * Get CSV file info
   */
  getInfo: async (filePath: string, options?: CsvReaderOptions) => {
    const reader = new CsvReader();
    return reader.getFileInfo(filePath, options);
  },

  /**
   * Validate CSV structure
   */
  validateStructure: async (filePath: string, options?: CsvReaderOptions) => {
    const reader = new CsvReader();
    return reader.validateCsvStructure(filePath, options);
  },
};
