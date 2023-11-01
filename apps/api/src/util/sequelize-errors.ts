import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import type { ValidationError } from 'express-validator';
import type { ValidationError as SequelizeValidationError } from 'sequelize/types/errors';
import type { ValidationErrorItem } from 'sequelize/types/errors/validation-error';
import { HttpStatusCode } from 'axios';

function toExpressValidationError(item: ValidationErrorItem): ValidationError {
  return {
    type: 'field',
    location: 'body',
    path: item.path ?? '',
    value: item.value,
    msg: item.message,
  };
}

// Convert Sequelize errors into a format compatible with express-validation
function toExpressValidationErrors(error: SequelizeValidationError) {
  const errors = Object.fromEntries(
    error.errors.map((sequelizeError) => [
      sequelizeError.path ?? '$',
      toExpressValidationError(sequelizeError),
    ])
  );

  return {
    errors,
    message: error.message,
  };
}

export const handleSequelizeErrors: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  switch (err.name) {
    case 'SequelizeUniqueConstraintError':
      res.status(HttpStatusCode.Conflict);
      res.json(toExpressValidationErrors(err as SequelizeValidationError));
      break;
    default:
      next(err);
  }
};
