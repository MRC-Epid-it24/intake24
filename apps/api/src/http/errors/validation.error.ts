import { ValidationError as ExpressValidationError } from 'express-validator';

export default class ValidationError extends Error {
  public errors: { [name: string]: ExpressValidationError } = {};

  constructor(msg: string, error?: Partial<ExpressValidationError>) {
    super(msg);

    if (!error || !error.param) return;

    const { param } = error;

    this.errors[param] = {
      param,
      msg,
      location: 'body',
      value: null,
      ...error,
    };
  }
}
