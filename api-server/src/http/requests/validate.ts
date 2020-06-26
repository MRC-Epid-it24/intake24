import validation from '@/http/middleware/validation';
import { RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';

export type ValidationMiddlerware = RequestHandler | ValidationChain;

export default (
  rules: ValidationMiddlerware | ValidationMiddlerware[]
): ValidationMiddlerware[] => {
  const items = Array.isArray(rules) ? rules : [rules];

  items.push(validation);
  return items;
};
