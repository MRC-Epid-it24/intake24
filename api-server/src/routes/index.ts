import { AppLoader } from '@/loaders/loader';
import api from './api';
import admin from './admin';
import docs from './docs';
import survey from './survey';

export default ({ app }: AppLoader): void => {
  // API
  app.use('/api', api);

  // Survey application
  app.use('/survey', survey);

  // Admin Tool application
  app.use('/admin', admin);

  // Documentation
  app.use('/docs', docs);

  /*
   * TODO: keep root for static / portal content
   * redirect to survey app for now
   */
  app.get('*', (req, res) => res.redirect('/survey'));
};
