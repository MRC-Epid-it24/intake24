import { Request, Response } from 'express';
import { AppLoader } from '@/loaders/loader';
import admin from './admin';

export default ({ app }: AppLoader): void => {
  app.use('/admin', admin);

  app.all('*', (req: Request, res: Response): void => {
    res.status(404).json('Route not found.');
  });
};
