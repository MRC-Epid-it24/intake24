import type { FieldValidationError } from 'express-validator';

export default class ValidationError extends Error {
  public errors: { [name: string]: FieldValidationError } = {};

  constructor(
    msg: string,
    error?: Partial<FieldValidationError> | Partial<FieldValidationError>[],
  ) {
    super(msg);

    if (!error)
      return;

    (Array.isArray(error) ? error : [error]).forEach((item) => {
      const { path } = item;
      if (!path)
        return;

      this.errors[path] = {
        type: 'field',
        path,
        msg,
        location: 'body',
        value: null,
        ...item,
      };
    });
  }
}
