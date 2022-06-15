import type { ValidationError as ExpressValidationError } from 'express-validator';

export default class ValidationError extends Error {
  public errors: { [name: string]: ExpressValidationError } = {};

  constructor(
    msg: string,
    error?: Partial<ExpressValidationError> | Partial<ExpressValidationError>[]
  ) {
    super(msg);

    if (!error) return;

    (Array.isArray(error) ? error : [error]).forEach((item) => {
      const { param } = item;
      if (!param) return;

      this.errors[param] = {
        param,
        msg,
        location: 'body',
        value: null,
        ...item,
      };
    });
  }
}
