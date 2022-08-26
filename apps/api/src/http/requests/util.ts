import type { RequestHandler } from 'express';
import type { Meta, ValidationChain } from 'express-validator';

import { validation } from '@intake24/api/http/middleware';

export type ValidationMiddleware = RequestHandler | ValidationChain;

export const validate = (
  rules: ValidationMiddleware | ValidationMiddleware[]
): ValidationMiddleware[] => {
  const items = Array.isArray(rules) ? rules : [rules];

  items.push(validation);
  return items;
};

export const errorMessage =
  (key: string) =>
  (value: any, { req }: Meta) =>
    req.scope.cradle.i18nService.translate(key);
