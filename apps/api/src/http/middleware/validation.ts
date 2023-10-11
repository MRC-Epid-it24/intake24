import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import {
  formatCustomValidationError,
  validationErrorStatusCode,
} from '@intake24/api/http/middleware/validation-errors';

export default (req: Request, res: Response, next: NextFunction): void => {
  const { i18nService } = req.scope.cradle;

  const result = validationResult(req);
  const status = validationErrorStatusCode(result.array());
  const errors = result.formatWith((error) => formatCustomValidationError(error, i18nService));

  if (errors.isEmpty()) {
    next();
    return;
  }

  res.status(status).json({ errors: errors.mapped(), message: 'Invalid input' });
};
