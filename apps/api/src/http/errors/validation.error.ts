import type { ExtendedFieldValidationError } from '../middleware';

import { HttpStatusCode } from 'axios';

export default class ValidationError extends Error {
  public errors: { [name: string]: ExtendedFieldValidationError } = {};
  public code: HttpStatusCode = 400;

  constructor(
    msg: string,
    error?: Partial<ExtendedFieldValidationError> | Partial<ExtendedFieldValidationError>[],
  ) {
    super(msg);

    if (!error)
      return;

    (Array.isArray(error) ? error : [error]).forEach((item) => {
      const { code, path } = item;
      if (!path)
        return;

      this.errors[path] = {
        code: code ?? null,
        type: 'field',
        path,
        msg,
        location: 'body',
        value: null,
        ...item,
      };
      this.setHttpStatus(this.errors[path]);
    });
  }

  setHttpStatus(error: ExtendedFieldValidationError) {
    switch (error.code) {
      case '$unique':
        this.code = 409;
        break;
      default:
        this.code = 400;
        break;
    }
  }
}
