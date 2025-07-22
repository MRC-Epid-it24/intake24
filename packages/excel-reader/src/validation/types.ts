export interface ValidationRule {
  name: string;
  field?: string | number;
  validate: (value: any, row?: any[], rowIndex?: number) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

export interface RowValidationResult {
  rowIndex: number;
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  data: any[];
}

export interface ValidationError {
  field: string | number;
  value: any;
  rule: string;
  message: string;
}

export interface ValidationWarning {
  field: string | number;
  value: any;
  rule: string;
  message: string;
}

export interface ValidationReport {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rowsWithWarnings: number;
  errors: RowValidationResult[];
  warnings: RowValidationResult[];
  summary: ValidationSummary;
}

export interface ValidationSummary {
  errorsByRule: Record<string, number>;
  warningsByRule: Record<string, number>;
  errorsByField: Record<string | number, number>;
  warningsByField: Record<string | number, number>;
  commonErrors: Array<{ message: string; count: number }>;
}

export interface ValidatorOptions {
  rules: ValidationRule[];
  stopOnFirstError?: boolean;
  includeValidRows?: boolean;
  maxErrors?: number;
}
