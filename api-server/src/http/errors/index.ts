import { Request, Response, NextFunction } from 'express';
import logger from '@/services/logger';
import { AppLoader } from '@/loaders/loader';
import ApplicationError from './application.error';
import ForbiddenError from './forbidden.error';
import InternalError from './internal-server.error';
import NotFoundError from './not-found.error';
import UnauthorizedError from './unauthorized.error';

export default ({ app }: AppLoader): void => {
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
    if (err instanceof InternalError) {
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
