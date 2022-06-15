import type { RequestHandler } from 'express';
import type { ValidationChain } from 'express-validator';
import { validation } from '@intake24/api/http/middleware';

export type ValidationMiddleware = RequestHandler | ValidationChain;

export default (rules: ValidationMiddleware | ValidationMiddleware[]): ValidationMiddleware[] => {
  const items = Array.isArray(rules) ? rules : [rules];

  items.push(validation);
  return items;
};
