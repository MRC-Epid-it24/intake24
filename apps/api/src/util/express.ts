import type { NextFunction, Request, RequestHandler, Response } from 'express';

import type { AsyncRequestHandler } from '@intake24/api/http/controllers';

export function unless(middleware: RequestHandler, ...paths: string[]) {
  return (req: Request, res: Response, next: NextFunction): void =>
    paths.includes(req.path) ? next() : middleware(req, res, next);
}

export function wrapAsync(fn: AsyncRequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): Promise<void> =>
    fn(req, res, next).catch(next);
}
