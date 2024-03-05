import type { RequestValidationError } from '@ts-rest/express';
import type { NextFunction, Request, Response } from 'express';
import type {
  AlternativeValidationError,
  FieldValidationError,
  GroupedAlternativeValidationError,
  UnknownFieldsError,
  ValidationError,
} from 'express-validator';
import type { ZodError, ZodIssueCode } from 'zod';
import type { ValidationError as ZodValidationError, ZodIssue } from 'zod-validation-error';
import { fromZodError } from 'zod-validation-error';

import type { I18nService } from '@intake24/api/services';
import type { I18nParams } from '@intake24/i18n';

export const standardErrorCodes = ['$unique', '$exists', '$restricted'] as const;

export type StandardErrorCode = (typeof standardErrorCodes)[number] | ZodIssueCode;

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

export function formatZodIssueMessage(issue: ZodIssue, i18nService: I18nService) {
  switch (issue.code) {
    case 'invalid_type':
      return i18nService.translate(`validation.types.${issue.expected}._`, {
        attribute: i18nService.translate(`validation.attributes.${issue.path.join('.')}`),
      });
    default:
      return issue.message;
  }
}

export const requestValidationErrorHandler = (
  err: RequestValidationError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { i18nService } = req.scope.cradle;
  const errors: Record<string, ExtendedValidationError> = {};

  let firstError: ZodValidationError;
  ['pathParams', 'headers', 'query', 'body'].forEach((key) => {
    const zKey = key as keyof typeof err;
    if (!err[zKey]) return;

    const error = fromZodError(err[zKey] as ZodError);
    if (!firstError) firstError = error;

    error.details.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = {
        type: 'field',
        location: key as any,
        code: issue.code,
        msg: formatZodIssueMessage(issue, i18nService),
        path,
        value: null,
      };
    });
  });

  return res.status(400).json({
    // name: firstError!.name,
    message: firstError!.message,
    errors,
  });
};
