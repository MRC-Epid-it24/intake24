import type { ValidationRule } from './types';

// Basic validation rules
export function required(fieldName: string | number): ValidationRule {
  return {
    name: 'required',
    field: fieldName,
    validate: value => ({
      valid: value !== null && value !== undefined && value !== '',
      error: `Field is required`,
    }),
  };
}

export function pattern(fieldName: string | number, regex: RegExp, message?: string): ValidationRule {
  return {
    name: 'pattern',
    field: fieldName,
    validate: (value) => {
      if (!value)
        return { valid: true }; // Skip if empty
      const valid = regex.test(String(value));
      return {
        valid,
        error: valid ? undefined : (message || `Invalid format`),
      };
    },
  };
}

export function oneOf(fieldName: string | number, validValues: any[], message?: string): ValidationRule {
  return {
    name: 'oneOf',
    field: fieldName,
    validate: (value) => {
      const valid = validValues.includes(value);
      return {
        valid,
        error: valid ? undefined : (message || `Value must be one of: ${validValues.join(', ')}`),
      };
    },
  };
}

export function length(fieldName: string | number, min?: number, max?: number): ValidationRule {
  return {
    name: 'length',
    field: fieldName,
    validate: (value) => {
      if (!value)
        return { valid: true };
      const len = String(value).length;
      if (min !== undefined && len < min) {
        return { valid: false, error: `Length must be at least ${min} characters` };
      }
      if (max !== undefined && len > max) {
        return { valid: false, error: `Length must be at most ${max} characters` };
      }
      return { valid: true };
    },
  };
}

export function numeric(fieldName: string | number): ValidationRule {
  return {
    name: 'numeric',
    field: fieldName,
    validate: (value) => {
      if (!value)
        return { valid: true };
      const valid = !Number.isNaN(Number(value));
      return {
        valid,
        error: valid ? undefined : `Value must be numeric`,
      };
    },
  };
}

export function range(fieldName: string | number, min?: number, max?: number): ValidationRule {
  return {
    name: 'range',
    field: fieldName,
    validate: (value) => {
      if (!value)
        return { valid: true };
      const num = Number(value);
      if (Number.isNaN(num)) {
        return { valid: false, error: `Value must be numeric` };
      }
      if (min !== undefined && num < min) {
        return { valid: false, error: `Value must be at least ${min}` };
      }
      if (max !== undefined && num > max) {
        return { valid: false, error: `Value must be at most ${max}` };
      }
      return { valid: true };
    },
  };
}

// Text validation rules
export function hasUnicodeRange(fieldName: string | number, rangeRegex: RegExp, rangeName: string): ValidationRule {
  return {
    name: 'hasUnicodeRange',
    field: fieldName,
    validate: (value) => {
      if (!value)
        return { valid: false, error: `${rangeName} text is required` };
      const valid = rangeRegex.test(String(value));
      return {
        valid,
        error: valid ? undefined : `Field must contain ${rangeName} characters`,
      };
    },
  };
}

// Japanese character validation
export function hasJapanese(fieldName: string | number): ValidationRule {
  // Japanese Unicode ranges: Hiragana (3040-309F), Katakana (30A0-30FF), Kanji (4E00-9FAF)
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  return hasUnicodeRange(fieldName, japaneseRegex, 'Japanese');
}
