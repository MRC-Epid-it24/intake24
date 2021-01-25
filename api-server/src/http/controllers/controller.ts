import { Request, Response, NextFunction } from 'express';

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type Controller<T extends string | number | symbol> = Record<T, AsyncRequestHandler>;

export type CrudActions = 'list' | 'create' | 'store' | 'detail' | 'edit' | 'update' | 'destroy';

export type CrudController = Controller<CrudActions>;
