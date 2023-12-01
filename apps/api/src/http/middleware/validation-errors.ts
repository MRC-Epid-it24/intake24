import type { FieldValidationError, ValidationError } from 'express-validator';
import type {
  AlternativeValidationError,
  GroupedAlternativeValidationError,
  UnknownFieldsError,
} from 'express-validator/src/base';

import type { I18nService } from '@intake24/api/services';
import type { I18nParams } from '@intake24/i18n';

export const standardErrorCodes = ['$unique', '$exists', '$restricted'] as const;

export type StandardErrorCode = (typeof standardErrorCodes)[number];

export interface ExtendedFieldValidationError extends FieldValidationError {
  code: StandardErrorCode | null;
}

export type ExtendedValidationError =
  | AlternativeValidationError
  | GroupedAlternativeValidationError
  | UnknownFieldsError
  | ExtendedFieldValidationError;

function getLocalisedTypeErrorMessage(
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

function createExtendedFieldValidationError(
  error: FieldValidationError,
  i18nService: I18nService
): ExtendedFieldValidationError {
  switch (error.msg) {
    case '$exists':
    case '$restricted':
    case '$unique':
      return {
        ...error,
        code: error.msg,
        msg: getLocalisedTypeErrorMessage(
          `${error.msg.replace('$', '')}._`,
          error.path,
          i18nService
        ),
      };
    default:
      return {
        ...error,
        code: null,
      };
  }
}

export function getValidationHttpStatus(error: ExtendedValidationError): number {
  switch (error.type) {
    case 'field':
      switch (error.code) {
        case '$unique':
          return 409;
        default:
          return 400;
      }
    default:
      return 400;
  }
}

export function createExtendedValidationError(
  error: ValidationError,
  i18nService: I18nService
): ExtendedValidationError {
  switch (error.type) {
    case 'field':
      return createExtendedFieldValidationError(error, i18nService);
    default:
      return error;
  }
}
