import { RequestHandler } from 'express';

export type Controller<T extends string | number | symbol> = Record<T, RequestHandler>;

export type CrudActions = 'list' | 'create' | 'store' | 'detail' | 'edit' | 'update' | 'destroy';

export type CrudController = Controller<CrudActions>;
