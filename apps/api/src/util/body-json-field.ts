import type { NextFunction, Request, Response } from 'express';

import { ValidationError } from '@intake24/api/http/errors';

/*
Replaces a JSON string in a parsed request body with a parsed JSON value.

This function must come after a body parser (e.g., urlencoded).

Useful when a request has to be in the form/multipart format (e.g., when including file uploads)
but passing data as flat string fields is awkward.
*/
export default (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
  const { i18nService } = req.scope.cradle;

  try {
    req.body[fieldName] = JSON.parse(req.body[fieldName]);
    next();
  } catch (e: any) {
    const msg = i18nService.translate('validation.types.json._', { attribute: fieldName });

    throw new ValidationError(msg, {
      type: 'field',
      location: 'body',
      path: fieldName,
      msg: e.message,
    });
  }
};
