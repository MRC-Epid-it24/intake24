import type {
  RowValidationResult,
  ValidationError,
  ValidationReport,
  ValidationSummary,
  ValidationWarning,
} from './types';
import { z } from 'zod';

/**
 * Zod-based validator with type-safe validation and detailed error reporting
 */
export interface ZodValidatorOptions<TSchema extends z.ZodSchema = z.ZodSchema> {
  /** The Zod schema to validate against */
  schema: TSchema;
  /** Stop validation after first error per row */
  stopOnFirstError?: boolean;
  /** Include valid rows in results */
  includeValidRows?: boolean;
  /** Maximum errors before stopping validation */
  maxErrors?: number;
  /** Custom error formatter */
  errorFormatter?: (issue: z.ZodIssue, rowIndex: number) => ValidationError;
  /** Custom warning formatter */
  warningFormatter?: (issue: z.ZodIssue, rowIndex: number) => ValidationWarning;
  /** Performance monitoring callback */
  onProgress?: (processed: number, total: number, errors: number) => void;
}

export class ZodValidator<TSchema extends z.ZodSchema = z.ZodSchema> {
  private schema: TSchema;
  private options: Required<Omit<ZodValidatorOptions<TSchema>, 'errorFormatter' | 'warningFormatter' | 'onProgress'>> &
    Pick<ZodValidatorOptions<TSchema>, 'errorFormatter' | 'warningFormatter' | 'onProgress'>;

  constructor(options: ZodValidatorOptions<TSchema>) {
    this.schema = options.schema;
    this.options = {
      stopOnFirstError: false,
      includeValidRows: false,
      maxErrors: 1000,
      ...options,
    };
  }

  /**
   * Validate array of data rows
   */
  validateData(data: unknown[][]): ValidationReport {
    const results: RowValidationResult[] = [];
    const errorResults: RowValidationResult[] = [];
    const warningResults: RowValidationResult[] = [];

    let errorCount = 0;
    const maxErrors = this.options.maxErrors;

    for (let i = 0; i < data.length; i++) {
      if (errorCount >= maxErrors) {
        console.warn(`Validation stopped after reaching maximum errors (${maxErrors})`);
        break;
      }

      const row = data[i];
      const result = this.validateRow(row, i);

      // Always include invalid rows and warnings
      if (!result.valid || result.warnings.length > 0) {
        results.push(result);
      }

      // Include valid rows if requested
      if (this.options.includeValidRows && result.valid && result.warnings.length === 0) {
        results.push(result);
      }

      if (!result.valid) {
        errorResults.push(result);
        errorCount += result.errors.length;
      }

      if (result.warnings.length > 0) {
        warningResults.push(result);
      }

      // Progress callback
      if (this.options.onProgress && (i + 1) % 100 === 0) {
        this.options.onProgress(i + 1, data.length, errorCount);
      }
    }

    // Final progress callback
    if (this.options.onProgress) {
      this.options.onProgress(data.length, data.length, errorCount);
    }

    const summary = this.generateSummary(errorResults, warningResults);

    return {
      totalRows: data.length,
      validRows: data.length - errorResults.length,
      invalidRows: errorResults.length,
      rowsWithWarnings: warningResults.length,
      errors: errorResults,
      warnings: warningResults,
      summary,
    };
  }

  /**
   * Validate a single row
   */
  private validateRow(row: unknown, rowIndex: number): RowValidationResult {
    const parseResult = this.schema.safeParse(row);

    if (parseResult.success) {
      return {
        rowIndex,
        valid: true,
        errors: [],
        warnings: [],
        data: row as any[],
      };
    }

    // Convert Zod issues to validation errors
    const errors: ValidationError[] = parseResult.error.issues.map(issue =>
      this.options.errorFormatter
        ? this.options.errorFormatter(issue, rowIndex)
        : this.defaultErrorFormatter(issue, rowIndex),
    );

    return {
      rowIndex,
      valid: false,
      errors,
      warnings: [], // Could be extended to extract warnings from certain issue types
      data: row as any[],
    };
  }

  /**
   * Default error formatter
   */
  private defaultErrorFormatter(issue: z.ZodIssue, _rowIndex: number): ValidationError {
    return {
      field: issue.path.join('.') || 'root',
      value: 'received' in issue ? issue.received : undefined,
      rule: issue.code,
      message: issue.message,
    };
  }

  /**
   * Generate validation summary
   */
  protected generateSummary(errorResults: RowValidationResult[], warningResults: RowValidationResult[]): ValidationSummary {
    const errorsByRule: Record<string, number> = {};
    const errorsByField: Record<string, number> = {};
    const warningsByRule: Record<string, number> = {};
    const warningsByField: Record<string, number> = {};
    const commonErrors: Array<{ message: string; count: number }> = [];

    // Count errors by rule and field
    errorResults.forEach((result) => {
      result.errors.forEach((error) => {
        errorsByRule[error.rule] = (errorsByRule[error.rule] || 0) + 1;
        errorsByField[error.field] = (errorsByField[error.field] || 0) + 1;
      });
    });

    // Count warnings by rule and field
    warningResults.forEach((result) => {
      result.warnings.forEach((warning) => {
        warningsByRule[warning.rule] = (warningsByRule[warning.rule] || 0) + 1;
        warningsByField[warning.field] = (warningsByField[warning.field] || 0) + 1;
      });
    });

    // Generate common errors
    const errorMessages: Record<string, number> = {};
    errorResults.forEach((result) => {
      result.errors.forEach((error) => {
        errorMessages[error.message] = (errorMessages[error.message] || 0) + 1;
      });
    });

    Object.entries(errorMessages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([message, count]) => {
        commonErrors.push({ message, count });
      });

    return {
      errorsByRule,
      errorsByField,
      warningsByRule,
      warningsByField,
      commonErrors,
    };
  }

  /**
   * Get the current schema
   */
  getSchema(): TSchema {
    return this.schema;
  }

  /**
   * Create a new validator with modified options
   */
  withOptions(newOptions: Partial<ZodValidatorOptions<TSchema>>): ZodValidator<TSchema> {
    return new ZodValidator({
      ...this.options,
      ...newOptions,
      schema: this.schema,
    });
  }
}
