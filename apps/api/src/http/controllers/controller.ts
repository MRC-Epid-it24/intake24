import type { Request, Response, NextFunction } from 'express';

export type AsyncRequestHandler = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => Promise<void>;
