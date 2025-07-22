import { z } from 'zod';

// === Core Zod Schema Building Blocks ===

/**
 * Advanced Zod-based validation schemas with composable building blocks
 * Following Zod best practices for type safety and performance
 */

// Base types with refinements
export const NonEmptyString = z.string().min(1, 'Value cannot be empty');
export const OptionalString = z.string().optional();
export const NumericString = z.string().regex(/^\d+(\.\d+)?$/, 'Must be numeric').transform(Number);
export const IntegerString = z.string().regex(/^\d+$/, 'Must be an integer').transform(Number);

// Unicode and character validation
export function createUnicodeSchema(regex: RegExp, description: string) {
  return z.string().refine(val => regex.test(val), { message: `Must contain ${description} characters` });
}

// Range validation with custom error messages
export function createRangeSchema(min?: number, max?: number) {
  let schema = z.number();
  if (min !== undefined) {
    schema = schema.min(min, `Value must be at least ${min}`);
  }
  if (max !== undefined) {
    schema = schema.max(max, `Value must be at most ${max}`);
  }
  return schema;
}

// Enum validation with transformation
export function createEnumSchema<T extends readonly [string, ...string[]]>(values: T, options?: {
  transform?: 'number' | 'uppercase' | 'lowercase';
  message?: string;
}) {
  const schema = z.enum(values, {
    errorMap: () => ({
      message: options?.message ?? `Value must be one of: ${values.join(', ')}`,
    }),
  });

  if (options?.transform === 'number') {
    return schema.transform(val => Number(val));
  }
  if (options?.transform === 'uppercase') {
    return schema.transform(val => val.toUpperCase());
  }
  if (options?.transform === 'lowercase') {
    return schema.transform(val => val.toLowerCase());
  }

  return schema;
}

// === Advanced Validation Patterns ===

// Cross-field validation
export function createConditionalSchema<T>(condition: (data: T) => boolean, schema: z.ZodSchema, fallback?: z.ZodSchema) {
  return z.any().superRefine((val, ctx) => {
    const shouldApply = condition(val as T);
    const targetSchema = shouldApply ? schema : (fallback ?? z.any());
    const result = targetSchema.safeParse(val);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: issue.message,
          path: issue.path,
        });
      });
    }
  });
}

// Array row validation with field mapping
export function createRowSchema<T extends Record<string, z.ZodSchema>>(fieldSchemas: T, options?: {
  allowExtraFields?: boolean;
  fieldNames?: Record<keyof T, string>;
}) {
  const { fieldNames = {} } = options ?? {};

  return z.array(z.unknown())
    .transform((row, ctx) => {
      const result: Record<string, unknown> = {};
      const errors: Array<{ field: string; message: string; index: number }> = [];

      // Validate each field
      Object.entries(fieldSchemas).forEach(([key, schema]) => {
        const fieldIndex = Number(key);
        const fieldName = (fieldNames as Record<string, string>)[key] ?? `Field ${fieldIndex}`;
        const value = row[fieldIndex];

        const parseResult = schema.safeParse(value);
        if (parseResult.success) {
          result[key] = parseResult.data;
        }
        else {
          parseResult.error.issues.forEach((issue) => {
            errors.push({
              field: fieldName,
              message: issue.message,
              index: fieldIndex,
            });
          });
        }
      });

      // Add errors to context
      errors.forEach((error) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error.message,
          path: [error.index],
        });
      });

      return result;
    });
}

// === CSV-Specific Validations ===

// Column count validation
export function createColumnCountSchema(expectedCount: number) {
  return z.array(z.unknown())
    .refine(
      row => row.length === expectedCount,
      row => ({ message: `Expected ${expectedCount} columns, found ${row.length}` }),
    );
}

// No empty rows
export const NoEmptyRowSchema = z.array(z.unknown())
  .refine(
    row => !row.every(cell => cell === null || cell === undefined || cell === '' || String(cell).trim() === ''),
    { message: 'Row cannot be completely empty' },
  );

// Unique value validation (stateful)
export function createUniqueValueSchema(fieldIndex: number, fieldName: string) {
  const seenValues = new Set<string>();

  return z.array(z.unknown())
    .refine((row) => {
      const value = String(row[fieldIndex] ?? '');
      if (!value)
        return true; // Allow empty values

      if (seenValues.has(value)) {
        return false;
      }
      seenValues.add(value);
      return true;
    }, {
      message: `Duplicate value in ${fieldName}`,
      path: [fieldIndex],
    });
}

// === Encoding and Character Validations ===

// Character encoding detection
export const EncodingValidationSchema = z.array(z.unknown())
  .refine((row) => {
    const encodingIssues: number[] = [];

    row.forEach((cell, index) => {
      if (cell && typeof cell === 'string') {
        const str = String(cell);
        // Check for replacement characters and mojibake patterns
        if (str.includes('�') || str.includes('\uFFFD') || str.match(/[\u00C0-\u00FF]{3,}/)) {
          encodingIssues.push(index);
        }
      }
    });

    return encodingIssues.length === 0;
  }, (row) => {
    const encodingIssues: number[] = [];
    row.forEach((cell, index) => {
      if (cell && typeof cell === 'string') {
        const str = String(cell);
        if (str.includes('�') || str.includes('\uFFFD') || str.match(/[\u00C0-\u00FF]{3,}/)) {
          encodingIssues.push(index);
        }
      }
    });
    return {
      message: `Potential encoding issues in columns: ${encodingIssues.join(', ')}`,
    };
  });

// Character consistency validation
export function createCharacterConsistencySchema(columnIndices: number[], columnNames: string[]) {
  return z.array(z.unknown())
    .refine((row) => {
      const warnings: string[] = [];

      columnIndices.forEach((colIndex, i) => {
        const cellValue = row[colIndex];
        if (cellValue) {
          const str = String(cellValue);
          if (str.match(/[\u00C3-\u00FF]/)) {
            warnings.push(`${columnNames[i] || `Column ${colIndex}`} may have encoding issues`);
          }
        }
      });

      return warnings.length === 0;
    }, (row) => {
      const warnings: string[] = [];
      columnIndices.forEach((colIndex, i) => {
        const cellValue = row[colIndex];
        if (cellValue) {
          const str = String(cellValue);
          if (str.match(/[\u00C3-\u00FF]/)) {
            warnings.push(`${columnNames[i] || `Column ${colIndex}`} may have encoding issues`);
          }
        }
      });
      return { message: warnings.join('; ') };
    });
}

// === Performance Optimized Schemas ===

// Lazy validation for large datasets
export function createLazyValidationSchema<T>(schemaFactory: () => z.ZodSchema<T>) {
  return z.lazy(schemaFactory);
}

// Batch processing schema
export function createBatchSchema<T>(itemSchema: z.ZodSchema<T>, batchSize: number = 1000) {
  return z.array(z.unknown())
    .transform((data, ctx) => {
      const results: T[] = [];
      const errors: Array<{ index: number; issues: z.ZodIssue[] }> = [];

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);

        batch.forEach((item, batchIndex) => {
          const globalIndex = i + batchIndex;
          const result = itemSchema.safeParse(item);

          if (result.success) {
            results[globalIndex] = result.data;
          }
          else {
            errors.push({
              index: globalIndex,
              issues: result.error.issues,
            });
          }
        });

        // Report progress every batch
        if (i > 0 && i % (batchSize * 10) === 0) {
          console.log(`Processed ${i}/${data.length} rows`);
        }
      }

      // Add all errors to context
      errors.forEach(({ index, issues }) => {
        issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: [index, ...issue.path],
          });
        });
      });

      return results;
    });
}

// === Schema Composition Utilities ===

// Merge multiple row schemas
export function mergeRowSchemas<T extends Record<string, z.ZodSchema>[]>(...schemas: T) {
  return schemas.reduce((acc, schema) => ({ ...acc, ...schema }), {} as T[number]);
}

// Create conditional field schema
export function conditionalField<T>(fieldSchema: z.ZodSchema<T>, condition: (row: unknown[]) => boolean) {
  return z.unknown().superRefine((val, ctx) => {
    const row = [] as unknown[]; // We can't access parent from refinement context directly
    if (condition(row)) {
      const result = fieldSchema.safeParse(val);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: issue.message,
          });
        });
      }
    }
  });
}

// === Error Handling Utilities ===

// Format Zod errors for user-friendly display
export function formatZodError(error: z.ZodError) {
  return error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));
}

// Create warning-only validation
export function createWarningSchema<T>(schema: z.ZodSchema<T>, warningMessage: string) {
  return z.unknown().transform((val, ctx) => {
    const result = schema.safeParse(val);
    if (!result.success) {
      // Add as warning instead of error
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: warningMessage,
        fatal: false,
      });
    }
    return val;
  });
}
