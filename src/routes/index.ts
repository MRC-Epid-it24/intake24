import { Request, Response } from 'express';
import { AppLoader } from '@/loaders/loader';
import authentication from './authentication';
import admin from './admin';
import password from './password';
import feedback from './feedback';
import foods from './foods';
import surveys from './surveys';

export default ({ app }: AppLoader): void => {
  app.use(authentication);
  app.use('/password', password);

  app.use('/admin', admin);

  app.use('/feedback', feedback);
  app.use('/foods', foods);
  app.use('/surveys', surveys);

  app.all('*', (req: Request, res: Response): void => {
    res.status(404).json('Route not found.');
  });
};
