import type { RequestHandler } from 'express';
import type { Meta, ValidationChain } from 'express-validator';

import type { I18nParams } from '@intake24/i18n/util';
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
  (key: string, params?: I18nParams) =>
  (value: any, { path, req }: Meta) => {
    const { i18nService } = req.scope.cradle;

    return i18nService.translate(key, {
      attribute: i18nService.translate(`validation.attributes.${path}`, path),
      ...params,
    });
  };

export const customErrorMessage = (key: string, { path, req }: Meta, params?: I18nParams) => {
  const { i18nService } = req.scope.cradle;

  return i18nService.translate(key, {
    attribute: i18nService.translate(`validation.attributes.${path}`, path),
    ...params,
  });
};

export const typeErrorMessage =
  (type: string, params: I18nParams = {}) =>
  (value: any, { path, req }: Meta) => {
    const { i18nService } = req.scope.cradle;

    return i18nService.translate(`validation.types.${type}`, {
      attribute: i18nService.translate(`validation.attributes.${path}`, path),
      ...params,
    });
  };

export const customTypeErrorMessage = (
  type: string,
  { path, req }: Meta,
  params: I18nParams = {}
) => {
  const { i18nService } = req.scope.cradle;

  return i18nService.translate(`validation.types.${type}`, {
    attribute: i18nService.translate(`validation.attributes.${path}`, path),
    ...params,
  });
};
