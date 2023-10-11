import type { ValidationError } from 'express-validator';

import type { I18nService } from '@intake24/api/services';
import type { I18nParams } from '@intake24/i18n';

function localisedTypeErrorMessage(
  type: string,
  attributePath: string,
  i18nService: I18nService,
  params: I18nParams = {}
): string {
  return i18nService.translate(`validation.types.${type}`, {
    attribute: i18nService.translate(`validation.attributes.${attributePath}`),
    ...params,
  });
}

function formatErrorMessage(message: string, attributePath: string, i18nService: I18nService) {
  switch (message) {
    case '$unique':
      return localisedTypeErrorMessage('unique._', attributePath, i18nService);
    case '$exists':
      return localisedTypeErrorMessage('exists._', attributePath, i18nService);
    default:
      return message;
  }
}

export function validationErrorStatusCode(errors: ValidationError[]): number {
  for (const error of errors) {
    switch (error.msg as string) {
      case '$unique':
        return 409;
      case '$exists':
        return 400;
    }
  }
  return 400;
}

export function formatCustomValidationError(
  error: ValidationError,
  i18nService: I18nService
): ValidationError {
  if (error.type === 'field')
    return {
      ...error,
      msg: formatErrorMessage(error.msg, error.path, i18nService),
    };
  else return error;
}
