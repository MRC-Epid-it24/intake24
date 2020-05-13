import { Request, Response } from 'express';
import authController from '@/http/controllers/authentication.controller';
import { AppLoader } from '@/loaders/loader';
import wrapAsync from '@/util/wrap-async';
import validation from '@/http/requests/authentication';
import admin from './admin';
import surveys from './surveys';

export default ({ app }: AppLoader): void => {
  app.post('/login', validation.emaiLogin, wrapAsync(authController.emailLogin));
  app.post('/login/alias', validation.aliasLogin, wrapAsync(authController.aliasLogin));
  app.get('/login/token/:token', wrapAsync(authController.tokenLogin));
  app.post('/refresh', wrapAsync(authController.refresh));
  app.post('/logout', wrapAsync(authController.logout));

  app.use('/admin', admin);
  app.use('/surveys', surveys);

  app.all('*', (req: Request, res: Response): void => {
    res.status(404).json('Route not found.');
  });
};
