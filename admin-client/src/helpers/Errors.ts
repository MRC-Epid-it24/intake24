import type { ValidationErrors } from '@/types';

export default class Errors {
  private errors: ValidationErrors;

  constructor() {
    this.errors = {};
  }

  get(field: string): string | undefined {
    return this.errors[field]?.msg;
  }

  has(field: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.errors, field);
  }

  all(): ValidationErrors {
    return this.errors;
  }

  record(errors?: ValidationErrors): void {
    if (typeof errors !== 'undefined') this.errors = errors;
  }

  clear(field?: string | string[]): void {
    if (Array.isArray(field)) {
      field.forEach((item) => delete this.errors[item]);
      return;
    }

    if (field) {
      const { [field]: discard, ...rest } = this.errors;
      this.errors = { ...rest };
      return;
    }

    this.errors = {};
  }

  any(): boolean {
    return Object.keys(this.errors).length > 0;
  }
}
