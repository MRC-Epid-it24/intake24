import type { ValidationRule } from './types.js';

// CSV-specific validation rules that take advantage of CSV format

export function csvColumnCount(expectedColumns: number): ValidationRule {
  return {
    name: 'csvColumnCount',
    validate: (value, row) => {
      if (!row)
        return { valid: true };

      const actualColumns = row.length;
      const valid = actualColumns === expectedColumns;

      return {
        valid,
        error: valid ? undefined : `Expected ${expectedColumns} columns, found ${actualColumns}`,
      };
    },
  };
}

export function csvNoEmptyRows(): ValidationRule {
  return {
    name: 'csvNoEmptyRows',
    validate: (value, row) => {
      if (!row)
        return { valid: false, error: 'Row is null or undefined' };

      // Check if all cells are empty
      const isEmpty = row.every(cell =>
        cell === null || cell === undefined || cell === '' || String(cell).trim() === '',
      );

      return {
        valid: !isEmpty,
        error: isEmpty ? 'Row is completely empty' : undefined,
      };
    },
  };
}

export function csvNoMalformedQuotes(): ValidationRule {
  return {
    name: 'csvNoMalformedQuotes',
    validate: (value, row, rowIndex) => {
      if (!row)
        return { valid: true };

      // Check for malformed quotes in any cell
      const malformedCells: number[] = [];

      row.forEach((cell, index) => {
        if (cell && typeof cell === 'string') {
          const str = String(cell);
          // Check for unescaped quotes
          if (str.includes('"') && !str.match(/^".*"$/) && str.includes(',')) {
            malformedCells.push(index);
          }
        }
      });

      return {
        valid: malformedCells.length === 0,
        warning: malformedCells.length > 0
          ? `Potential malformed quotes in columns: ${malformedCells.join(', ')}`
          : undefined,
      };
    },
  };
}

export function csvUniqueValues(fieldIndex: number, fieldName: string): ValidationRule {
  const seenValues = new Set<string>();

  return {
    name: 'csvUniqueValues',
    field: fieldIndex,
    validate: (value) => {
      if (!value)
        return { valid: true };

      const strValue = String(value);
      if (seenValues.has(strValue)) {
        return {
          valid: false,
          error: `Duplicate value "${strValue}" in ${fieldName}`,
        };
      }

      seenValues.add(strValue);
      return { valid: true };
    },
  };
}

export function csvEncoding(): ValidationRule {
  return {
    name: 'csvEncoding',
    validate: (value, row) => {
      if (!row)
        return { valid: true };

      const encodingIssues: number[] = [];

      row.forEach((cell, index) => {
        if (cell && typeof cell === 'string') {
          const str = String(cell);

          // Check for common encoding issues (replacement characters)
          if (str.includes('�') || str.includes('\uFFFD')) {
            encodingIssues.push(index);
          }

          // Check for potential mojibake patterns
          if (str.match(/[À-ÿ]{3,}/)) {
            encodingIssues.push(index);
          }
        }
      });

      return {
        valid: encodingIssues.length === 0,
        warning: encodingIssues.length > 0
          ? `Potential encoding issues in columns: ${encodingIssues.join(', ')}`
          : undefined,
      };
    },
  };
}

export function csvDataTypes(columnTypes: Record<number, 'string' | 'number' | 'boolean' | 'date'>): ValidationRule {
  return {
    name: 'csvDataTypes',
    validate: (value, row) => {
      if (!row)
        return { valid: true };

      const typeErrors: string[] = [];

      Object.entries(columnTypes).forEach(([colIndex, expectedType]) => {
        const index = Number.parseInt(colIndex);
        const cellValue = row[index];

        if (cellValue === null || cellValue === undefined || cellValue === '') {
          return; // Skip empty cells
        }

        const isValidType = validateDataType(cellValue, expectedType);
        if (!isValidType) {
          typeErrors.push(`Column ${index} should be ${expectedType}, got: ${typeof cellValue}`);
        }
      });

      return {
        valid: typeErrors.length === 0,
        warning: typeErrors.length > 0 ? typeErrors.join('; ') : undefined,
      };
    },
  };
}

function validateDataType(value: any, expectedType: string): boolean {
  switch (expectedType) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return !isNaN(Number(value)) && isFinite(Number(value));
    case 'boolean':
      return typeof value === 'boolean'
        || ['true', 'false', '1', '0', 'yes', 'no'].includes(String(value).toLowerCase());
    case 'date':
      return !isNaN(Date.parse(String(value)));
    default:
      return true;
  }
}

export function csvConsistentDelimiters(): ValidationRule {
  return {
    name: 'csvConsistentDelimiters',
    validate: (value, row, rowIndex) => {
      if (!row)
        return { valid: true };

      // This is a simplified check - in practice, the CSV parser would handle this
      // But we can check for common issues like mixed delimiters
      const rowStr = row.join(',');
      const hasSemicolon = rowStr.includes(';');
      const hasTab = rowStr.includes('\t');

      if (hasSemicolon || hasTab) {
        return {
          valid: true,
          warning: 'Row contains semicolons or tabs - check delimiter settings',
        };
      }

      return { valid: true };
    },
  };
}

// Generic character validation rules
export function csvCharacterConsistency(columnIndices: number[], columnNames: string[]): ValidationRule {
  return {
    name: 'csvCharacterConsistency',
    validate: (value, row) => {
      if (!row)
        return { valid: true };

      const warnings: string[] = [];

      columnIndices.forEach((colIndex, i) => {
        const cellValue = row[colIndex];
        if (cellValue) {
          const str = String(cellValue);
          if (str.match(/[Ã-ÿ]/)) {
            warnings.push(`${columnNames[i] || `Column ${colIndex}`} may have encoding issues`);
          }
        }
      });

      return {
        valid: warnings.length === 0,
        warning: warnings.length > 0 ? warnings.join('; ') : undefined,
      };
    },
  };
}

export function csvTextNormalization(columnIndices: number[], columnNames: string[]): ValidationRule {
  return {
    name: 'csvTextNormalization',
    validate: (value, row) => {
      if (!row)
        return { valid: true };

      const warnings: string[] = [];

      columnIndices.forEach((colIndex, i) => {
        const cellValue = row[colIndex];
        if (cellValue) {
          const str = String(cellValue);
          // Check for full-width ASCII characters (common in CJK text)
          if (str.match(/[Ａ-Ｚ０-９]/i)) {
            warnings.push(`${columnNames[i] || `Column ${colIndex}`} contains full-width ASCII characters`);
          }
        }
      });

      return {
        valid: true,
        warning: warnings.length > 0 ? warnings.join('; ') : undefined,
      };
    },
  };
}

// Performance-optimized rules for large CSV files
export function csvBatchUniqueCheck(fieldIndex: number, fieldName: string, batchSize: number = 10000): ValidationRule {
  const seenValues = new Set<string>();
  let processedCount = 0;

  return {
    name: 'csvBatchUniqueCheck',
    field: fieldIndex,
    validate: (value) => {
      if (!value)
        return { valid: true };

      const strValue = String(value);
      processedCount++;

      if (seenValues.has(strValue)) {
        return {
          valid: false,
          error: `Duplicate value "${strValue}" in ${fieldName} (processed ${processedCount} rows)`,
        };
      }

      seenValues.add(strValue);

      // Clear cache periodically to prevent memory issues
      if (processedCount % batchSize === 0) {
        console.log(`Processed ${processedCount} rows for uniqueness check`);
      }

      return { valid: true };
    },
  };
}

export function csvMemoryEfficientValidation(): ValidationRule {
  return {
    name: 'csvMemoryEfficientValidation',
    validate: (value, row, rowIndex) => {
    // Log progress every 1000 rows
      if (rowIndex && rowIndex % 1000 === 0) {
        console.log(`Validated ${rowIndex} rows`);
      }

      return { valid: true };
    },
  };
}
