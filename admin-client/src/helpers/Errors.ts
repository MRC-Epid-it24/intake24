import { ValidationError } from '@common/types/common';

export default class Errors {
  private errors: ValidationError;

  constructor() {
    this.errors = {};
  }

  get(field: string): string | undefined {
    return this.errors[field]?.msg;
  }

  has(field: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.errors, field);
  }

  record(errors?: ValidationError): void {
    if (typeof errors !== 'undefined') this.errors = errors;
  }

  clear(field?: string | string[]): void {
    if (Array.isArray(field)) {
      field.forEach((item) => delete this.errors[item]);
      return;
    }

    if (field) {
      delete this.errors[field];
      return;
    }

    this.errors = {};
  }

  any(): boolean {
    return Object.keys(this.errors).length > 0;
  }
}
