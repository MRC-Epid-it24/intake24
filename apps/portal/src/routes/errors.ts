import type { Express, NextFunction, Request, Response } from 'express';

import type { Ops } from '../app';

export default (app: Express, { logger }: Ops): void => {
  // Express error middleware is identified by this params pattern, keep all
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const { message, name, stack } = err;
    logger.error(stack ?? `${name}: ${message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  });
};
