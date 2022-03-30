import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { AsyncRequestHandler } from '@intake24/api/http/controllers';

export const unless =
  (middleware: RequestHandler, ...paths: string[]) =>
  (req: Request, res: Response, next: NextFunction): void =>
    paths.some((path) => path === req.path) ? next() : middleware(req, res, next);

export const wrapAsync =
  (fn: AsyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): Promise<void> =>
    fn(req, res, next).catch(next);
