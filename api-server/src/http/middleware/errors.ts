import { Express, Request, Response, NextFunction } from 'express';
import type { Ops } from '@/app';
import {
  ApplicationError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../errors';

export default (app: Express, { logger }: Ops): void => {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApplicationError) {
      const { message } = err;
      res.status(400).json({ message });
      return;
    }
    next(err);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof UnauthorizedError) {
      const { message } = err;
      res.status(401).json({ message });
      return;
    }
    next(err);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ForbiddenError) {
      const { message } = err;
      res.status(403).json({ message });
      return;
    }
    next(err);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
      const { message } = err;
      res.status(404).json({ message });
      return;
    }
    next(err);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
      const { errors } = err;
      res.status(422).json({ errors });
      return;
    }
    next(err);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof InternalServerError) {
      const { message, name, stack } = err;
      logger.error(stack ?? `${name}: ${message}`);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    next(err);
  });

  // Express error middleware is identified by this params pattern, keep all
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const { message, name, stack } = err;
    logger.error(stack ?? `${name}: ${message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  });
};
