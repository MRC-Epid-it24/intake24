import type {
  RowValidationResult,
  ValidationReport,
} from './types.js';
import type { ZodValidatorOptions } from './validator.js';
import { z } from 'zod';
import { CsvReader } from '../csv-reader.js';
import {
  createCharacterConsistencySchema,
  createColumnCountSchema,
  createUniqueValueSchema,
  EncodingValidationSchema,
  NoEmptyRowSchema,
} from './schemas.js';
import { ZodValidator } from './validator.js';

/**
 * Advanced CSV-specific validator using Zod schemas
 *
 * Extends the base ZodValidator with CSV-specific functionality:
 * - CSV structure validation
 * - Row filtering capabilities
 * - Streaming support for large files
 * - CSV-specific error handling
 */

export interface CsvValidatorOptions<TSchema extends z.ZodSchema = z.ZodSchema>
  extends ZodValidatorOptions<TSchema> {
  csvOptions?: {
    delimiter?: string;
    quote?: string;
    escape?: string;
    skipEmptyLines?: boolean;
    columns?: boolean | string[];
    encoding?: BufferEncoding;
  };
  streaming?: boolean;
  batchSize?: number;
  skipHeaderValidation?: boolean;
  rowFilter?: (row: unknown[], rowIndex: number) => boolean;
  enableCsvValidation?: {
    columnCount?: number;
    encoding?: boolean;
    emptyRows?: boolean;
    uniqueFields?: Array<{ index: number; name: string }>;
    characterConsistency?: Array<{ indices: number[]; names: string[] }>;
  };
}

export class CsvValidator<TSchema extends z.ZodSchema = z.ZodSchema> extends ZodValidator<TSchema> {
  private csvReader: CsvReader;
  private csvOptions: CsvValidatorOptions<TSchema>;

  constructor(options: CsvValidatorOptions<TSchema>) {
    super(options);
    this.csvReader = new CsvReader();
    this.csvOptions = {
      streaming: false,
      batchSize: 1000,
      skipHeaderValidation: false,
      csvOptions: {
        delimiter: ',',
        quote: '"',
        columns: true,
        skipEmptyLines: true,
        encoding: 'utf8',
      },
      ...options,
    };
  }

  /**
   * Validate CSV file with comprehensive CSV-specific checks
   */
  async validateCsvFile(filePath: string): Promise<ValidationReport> {
    // First validate CSV structure
    const structureValidation = await this.csvReader.validateCsvStructure(
      filePath,
      this.csvOptions.csvOptions,
    );

    if (!structureValidation.isValid) {
      return this.createStructureErrorReport(filePath, structureValidation);
    }

    // Choose validation strategy based on options
    if (this.csvOptions.streaming) {
      return this.validateCsvFileStreaming(filePath);
    }
    else {
      return this.validateCsvFileInMemory(filePath);
    }
  }

  /**
   * Validate CSV file by loading into memory (faster for smaller files)
   */
  private async validateCsvFileInMemory(filePath: string): Promise<ValidationReport> {
    const data = this.csvReader.readFile(filePath, this.csvOptions.csvOptions);
    const arrayData = this.csvReader.toArrayFormat(data);

    // Skip header row if needed
    const dataToValidate = this.csvOptions.skipHeaderValidation ? arrayData.slice(1) : arrayData;

    // Apply row filtering
    const filteredData = this.applyRowFiltering(dataToValidate);

    // Create composite schema with CSV validations
    const compositeSchema = this.createCompositeSchema();

    // Validate with the composite schema
    const { schema: _, ...validatorOptions } = this.csvOptions;
    const baseValidator = new ZodValidator({
      schema: compositeSchema,
      ...validatorOptions,
    });

    return baseValidator.validateData(filteredData);
  }

  /**
   * Validate CSV file using streaming (memory efficient for large files)
   */
  private async validateCsvFileStreaming(filePath: string): Promise<ValidationReport> {
    const results: RowValidationResult[] = [];
    const errorResults: RowValidationResult[] = [];
    const warningResults: RowValidationResult[] = [];

    let totalRows = 0;
    let excludedRows = 0;
    let skipFirstRow = this.csvOptions.skipHeaderValidation;
    let processedErrors = 0;
    const maxErrors = this.csvOptions.maxErrors || 1000;

    // Create composite schema
    const compositeSchema = this.createCompositeSchema();

    await this.csvReader.readFileStream(filePath, {
      ...this.csvOptions.csvOptions,
      batchSize: this.csvOptions.batchSize || 1000,
      onRow: (row, rowIndex) => {
        // Skip header row if needed
        if (skipFirstRow && rowIndex === 0) {
          skipFirstRow = false;
          return;
        }

        if (processedErrors >= maxErrors) {
          return;
        }

        // Convert row to array format if needed
        const arrayRow = Array.isArray(row) ? row : Object.values(row);

        // Apply row filtering
        if (this.shouldExcludeRow(arrayRow, totalRows)) {
          excludedRows++;
          return;
        }

        // Validate with composite schema
        const parseResult = compositeSchema.safeParse(arrayRow);

        const result: RowValidationResult = {
          rowIndex: totalRows,
          valid: parseResult.success,
          errors: parseResult.success
            ? []
            : parseResult.error.issues.map(issue => ({
                field: issue.path.join('.') || 'row',
                value: 'received' in issue ? issue.received : arrayRow,
                rule: issue.code,
                message: issue.message,
              })),
          warnings: [], // TODO: Extract warnings from Zod issues
          data: arrayRow,
        };

        if (!result.valid || result.warnings.length > 0) {
          results.push(result);
        }

        if (!result.valid) {
          errorResults.push(result);
          processedErrors += result.errors.length;
        }

        if (result.warnings.length > 0) {
          warningResults.push(result);
        }

        totalRows++;
      },
      onError: (error, rowIndex) => {
        console.error(`Error processing row ${rowIndex}:`, error);
        errorResults.push({
          rowIndex,
          valid: false,
          errors: [{
            field: 'row',
            value: rowIndex,
            rule: 'csvParsing',
            message: error.message,
          }],
          warnings: [],
          data: [],
        });
      },
    });

    if (excludedRows > 0) {
      console.log(`ℹ️  Excluded ${excludedRows} rows using custom filter`);
    }

    const summary = this.generateSummary(errorResults, warningResults);

    return {
      totalRows,
      validRows: totalRows - errorResults.length,
      invalidRows: errorResults.length,
      rowsWithWarnings: warningResults.length,
      errors: errorResults,
      warnings: warningResults,
      summary,
    };
  }

  /**
   * Validate CSV file with progress reporting
   */
  async validateCsvFileWithProgress(
    filePath: string,
    onProgress?: (progress: { processed: number; total: number; errors: number }) => void,
  ): Promise<ValidationReport> {
    // Get file info first to know total rows
    const fileInfo = await this.csvReader.getFileInfo(filePath, this.csvOptions.csvOptions);
    const totalRows = fileInfo.totalRows;

    const results: RowValidationResult[] = [];
    const errorResults: RowValidationResult[] = [];
    const warningResults: RowValidationResult[] = [];

    let processedRows = 0;
    let skipFirstRow = this.csvOptions.skipHeaderValidation;
    let processedErrors = 0;
    const maxErrors = this.csvOptions.maxErrors || 1000;

    // Create composite schema
    const compositeSchema = this.createCompositeSchema();

    await this.csvReader.readFileStream(filePath, {
      ...this.csvOptions.csvOptions,
      batchSize: this.csvOptions.batchSize || 1000,
      onBatch: (_batch, _batchIndex) => {
        if (onProgress) {
          onProgress({
            processed: processedRows,
            total: totalRows,
            errors: processedErrors,
          });
        }
      },
      onRow: (row, rowIndex) => {
        // Skip header row if needed
        if (skipFirstRow && rowIndex === 0) {
          skipFirstRow = false;
          return;
        }

        if (processedErrors >= maxErrors) {
          return;
        }

        // Convert row to array format if needed
        const arrayRow = Array.isArray(row) ? row : Object.values(row);

        // Apply row filtering
        if (this.shouldExcludeRow(arrayRow, processedRows)) {
          return;
        }

        // Validate with composite schema
        const parseResult = compositeSchema.safeParse(arrayRow);

        const result: RowValidationResult = {
          rowIndex: processedRows,
          valid: parseResult.success,
          errors: parseResult.success
            ? []
            : parseResult.error.issues.map(issue => ({
                field: issue.path.join('.') || 'row',
                value: 'received' in issue ? issue.received : arrayRow,
                rule: issue.code,
                message: issue.message,
              })),
          warnings: [],
          data: arrayRow,
        };

        if (!result.valid || result.warnings.length > 0) {
          results.push(result);
        }

        if (!result.valid) {
          errorResults.push(result);
          processedErrors += result.errors.length;
        }

        if (result.warnings.length > 0) {
          warningResults.push(result);
        }

        processedRows++;
      },
    });

    // Final progress update
    if (onProgress) {
      onProgress({
        processed: processedRows,
        total: totalRows,
        errors: processedErrors,
      });
    }

    const summary = this.generateSummary(errorResults, warningResults);

    return {
      totalRows: processedRows,
      validRows: processedRows - errorResults.length,
      invalidRows: errorResults.length,
      rowsWithWarnings: warningResults.length,
      errors: errorResults,
      warnings: warningResults,
      summary,
    };
  }

  /**
   * Create a composite schema that includes both user schema and CSV validations
   */
  private createCompositeSchema(): z.ZodSchema {
    const schemas: z.ZodSchema[] = [this.getSchema()];

    // Add CSV-specific validations if enabled
    if (this.csvOptions.enableCsvValidation) {
      const csvValidations = this.csvOptions.enableCsvValidation;

      if (csvValidations.columnCount !== undefined) {
        schemas.push(createColumnCountSchema(csvValidations.columnCount));
      }

      if (csvValidations.emptyRows) {
        schemas.push(NoEmptyRowSchema);
      }

      if (csvValidations.encoding) {
        schemas.push(EncodingValidationSchema);
      }

      if (csvValidations.uniqueFields) {
        csvValidations.uniqueFields.forEach(({ index, name }) => {
          schemas.push(createUniqueValueSchema(index, name));
        });
      }

      if (csvValidations.characterConsistency) {
        csvValidations.characterConsistency.forEach(({ indices, names }) => {
          schemas.push(createCharacterConsistencySchema(indices, names));
        });
      }
    }

    // If only one schema, return it directly
    if (schemas.length === 1) {
      return schemas[0];
    }

    // Combine multiple schemas using intersection
    return schemas.reduce((acc, schema) => acc.and(schema));
  }

  /**
   * Apply row filtering if configured
   */
  private applyRowFiltering(data: unknown[][]): unknown[][] {
    if (!this.csvOptions.rowFilter) {
      return data;
    }

    const filteredData = data.filter((row, index) =>
      !this.shouldExcludeRow(row, index),
    );

    const excludedCount = data.length - filteredData.length;
    if (excludedCount > 0) {
      console.log(`ℹ️  Excluded ${excludedCount} rows using custom filter`);
    }

    return filteredData;
  }

  /**
   * Check if a row should be excluded from validation using custom filter
   */
  private shouldExcludeRow(row: unknown[], rowIndex: number): boolean {
    return this.csvOptions.rowFilter ? !this.csvOptions.rowFilter(row, rowIndex) : false;
  }

  /**
   * Create validation report for CSV structure errors
   */
  private createStructureErrorReport(
    filePath: string,
    structureValidation: { isValid: boolean; errors: string[]; warnings: string[] },
  ): ValidationReport {
    return {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      rowsWithWarnings: 0,
      errors: [{
        rowIndex: -1,
        valid: false,
        errors: structureValidation.errors.map(error => ({
          field: 'file',
          value: filePath,
          rule: 'csvStructure',
          message: error,
        })),
        warnings: structureValidation.warnings.map(warning => ({
          field: 'file',
          value: filePath,
          rule: 'csvStructure',
          message: warning,
        })),
        data: [],
      }],
      warnings: [],
      summary: {
        errorsByRule: { csvStructure: structureValidation.errors.length },
        warningsByRule: { csvStructure: structureValidation.warnings.length },
        errorsByField: { file: structureValidation.errors.length },
        warningsByField: { file: structureValidation.warnings.length },
        commonErrors: structureValidation.errors.map(error => ({ message: error, count: 1 })),
      },
    };
  }

  /**
   * Create a new CSV validator with modified options
   */
  withCsvOptions(newOptions: Partial<CsvValidatorOptions<TSchema>>): CsvValidator<TSchema> {
    return new CsvValidator({
      ...this.csvOptions,
      ...newOptions,
    });
  }
}

// === Utility Functions ===

/**
 * Create a CSV validator from a Zod schema
 */
export function createCsvValidator<T extends z.ZodSchema>(
  schema: T,
  options?: Omit<CsvValidatorOptions<T>, 'schema'>,
): CsvValidator<T> {
  return new CsvValidator({ schema, ...options });
}

/**
 * Create a high-performance CSV validator for large files
 */
export function createStreamCsvValidator<T extends z.ZodSchema>(
  schema: T,
  options?: Omit<CsvValidatorOptions<T>, 'schema'>,
): CsvValidator<T> {
  return createCsvValidator(schema, {
    streaming: true,
    batchSize: 5000,
    maxErrors: 10000,
    onProgress: (processed, total, errors) => {
      if (processed % 5000 === 0) {
        console.log(`📊 CSV Validation: ${processed}/${total} rows (${errors} errors)`);
      }
    },
    enableCsvValidation: {
      encoding: true,
      emptyRows: true,
    },
    ...options,
  });
}

/**
 * Validate CSV file once with a schema
 */
export async function validateCsvWithSchema<T extends z.ZodSchema>(
  schema: T,
  filePath: string,
  options?: Omit<CsvValidatorOptions<T>, 'schema'>,
): Promise<ValidationReport> {
  const validator = createCsvValidator(schema, options);
  return validator.validateCsvFile(filePath);
}

/**
 * Create a CSV validator specifically for Japanese food lists
 * This is a placeholder implementation - customize with actual validation rules
 */
/**
 * Japanese food list column indices
 */
const JP_FOOD_COLUMNS = {
  INTAKE24_CODE: 0, // Intake24 Code
  ACTION: 1, // Action (1,2,3,4)
  ENGLISH_DESC: 2, // English Description
  JAPANESE_DESC: 3, // Japanese Description
  COMPOSITION_TABLE: 4, // Food Composition Table
  COMPOSITION_ID: 5, // Composition Record ID
  BRAND_NAMES: 12, // Brand Names
  SYNONYMS: 13, // Synonyms
  PORTION_METHODS: 14, // Portion Size Methods
  CATEGORIES: 15, // Categories
} as const;

/**
 * Create a specialized validator for Japanese food list CSV files
 *
 * Expected format:
 * - Column 0: Intake24 Code (1-32 characters)
 * - Column 1: Action (1, 2, 3, or 4)
 * - Column 2: English Description (required)
 * - Column 3: Japanese Description (required, must contain Japanese characters)
 * - Column 4: Food Composition Table (AUSNUT, STFCJ, DCD for Japan, NDNS)
 * - Column 5: Composition Record ID
 * - Column 12: Brand Names
 * - Column 13: Synonyms (Japanese)
 * - Column 14: Portion Size Methods
 * - Column 15: Categories
 */
export function createCsvJapanFoodListValidator(
  options?: Omit<CsvValidatorOptions, 'schema'>,
): CsvValidator {
  // Japanese character validation regex (Hiragana, Katakana, Kanji)
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

  // Intake24 code validation - allow any non-empty string up to 32 characters
  const intake24CodeRegex = /^.{1,32}$/;

  // Valid food composition tables
  const validCompositionTables = ['AUSNUT', 'STFCJ', 'DCD for Japan', 'NDNS'];

  // Schema for Japanese food list validation (expecting 18 columns minimum)
  const schema = z.array(z.string()).min(16, 'Food list must have at least 16 columns').refine((row) => {
    // Skip validation for rows with action = '1' (update existing, not importing)
    const action = row[JP_FOOD_COLUMNS.ACTION]?.toString().trim();
    if (action === '1') {
      return true;
    }

    // Intake24 code validation
    const code = row[JP_FOOD_COLUMNS.INTAKE24_CODE]?.toString().trim();
    if (!code || !intake24CodeRegex.test(code)) {
      return false;
    }

    // Action validation (must be 1, 2, 3, or 4)
    if (!['1', '2', '3', '4'].includes(action || '')) {
      return false;
    }

    // English description required
    const englishDesc = row[JP_FOOD_COLUMNS.ENGLISH_DESC]?.toString().trim();
    if (!englishDesc) {
      return false;
    }

    // Japanese description required and must contain Japanese characters
    const japaneseDesc = row[JP_FOOD_COLUMNS.JAPANESE_DESC]?.toString().trim();
    if (!japaneseDesc || !japaneseRegex.test(japaneseDesc)) {
      return false;
    }

    // Food composition table validation (if provided)
    const compositionTable = row[JP_FOOD_COLUMNS.COMPOSITION_TABLE]?.toString().trim();
    if (compositionTable && !validCompositionTables.includes(compositionTable)) {
      return false;
    }

    // Synonyms should contain Japanese characters (if provided)
    const synonyms = row[JP_FOOD_COLUMNS.SYNONYMS]?.toString().trim();
    if (synonyms && !japaneseRegex.test(synonyms)) {
      return false;
    }

    return true;
  }, (row) => {
    const action = row[JP_FOOD_COLUMNS.ACTION]?.toString().trim();
    const code = row[JP_FOOD_COLUMNS.INTAKE24_CODE]?.toString().trim();
    const englishDesc = row[JP_FOOD_COLUMNS.ENGLISH_DESC]?.toString().trim();
    const japaneseDesc = row[JP_FOOD_COLUMNS.JAPANESE_DESC]?.toString().trim();
    const compositionTable = row[JP_FOOD_COLUMNS.COMPOSITION_TABLE]?.toString().trim();
    const synonyms = row[JP_FOOD_COLUMNS.SYNONYMS]?.toString().trim();

    // Skip validation messages for action = '1' rows
    if (action === '1')
      return { message: 'Row validation skipped (action=1)' };

    // Detailed error messages
    if (!code || !intake24CodeRegex.test(code)) {
      return { message: `Invalid Intake24 code: "${code}". Must be 1-32 characters long` };
    }
    if (!['1', '2', '3', '4'].includes(action || '')) {
      return { message: `Invalid action: "${action}". Must be 1, 2, 3, or 4` };
    }
    if (!englishDesc) {
      return { message: 'English description is required' };
    }
    if (!japaneseDesc) {
      return { message: 'Japanese description is required' };
    }
    if (japaneseDesc && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(japaneseDesc)) {
      return { message: `Japanese description must contain Japanese characters: "${japaneseDesc}"` };
    }
    if (compositionTable && !validCompositionTables.includes(compositionTable)) {
      return { message: `Invalid composition table: "${compositionTable}". Must be one of: ${validCompositionTables.join(', ')}` };
    }
    if (synonyms && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(synonyms)) {
      return { message: `Synonyms must contain Japanese characters: "${synonyms}"` };
    }

    return { message: 'Row validation failed' };
  });

  return new CsvValidator({
    schema,
    streaming: options?.streaming ?? true, // Enable streaming for large food lists
    batchSize: options?.batchSize ?? 2000,
    skipHeaderValidation: true, // Japanese food lists have headers
    maxErrors: options?.maxErrors ?? 1000,
    csvOptions: {
      delimiter: ',',
      quote: '"',
      skipEmptyLines: true,
      encoding: 'utf8',
      ...(options?.csvOptions || {}),
    },
    enableCsvValidation: {
      columnCount: 18, // Expect 18 columns for complete Japanese food list
      encoding: true, // Check for encoding issues
      emptyRows: true, // Skip empty rows
      uniqueFields: [
        { index: JP_FOOD_COLUMNS.INTAKE24_CODE, name: 'Intake24 Code' },
      ],
      ...(options?.enableCsvValidation || {}),
    },
    // Filter out rows with action='1' from validation (they're updates, not new imports)
    rowFilter: (row, rowIndex) => {
      // Always validate header row (index 0)
      if (rowIndex === 0)
        return true;

      // For data rows, validate all actions but with different rules for action='1'
      return true;
    },
    ...options,
  });
}
