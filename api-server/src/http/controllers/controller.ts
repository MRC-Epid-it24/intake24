import { Request, Response, NextFunction } from 'express';

export type AsyncRequestHandler = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type Controller<T extends string | number | symbol> = Record<T, AsyncRequestHandler>;

export type CrudActions = 'browse' | 'create' | 'store' | 'read' | 'edit' | 'update' | 'destroy';

export type CrudController = Controller<CrudActions>;
