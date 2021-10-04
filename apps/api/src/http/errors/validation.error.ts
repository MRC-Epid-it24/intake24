import { ValidationError as ExpressValidationError } from 'express-validator';

export default class ValidationError extends Error {
  public errors: { [name: string]: ExpressValidationError } = {};

  constructor(param: string, msg: string) {
    super(msg);

    this.errors[param] = {
      param,
      msg,
      location: 'body',
      value: null,
    };
  }
}
