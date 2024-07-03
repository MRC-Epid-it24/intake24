import { ExtendedFieldValidationError } from '../middleware';

export default class ValidationError extends Error {
  public errors: { [name: string]: ExtendedFieldValidationError } = {};

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
    });
  }
}
