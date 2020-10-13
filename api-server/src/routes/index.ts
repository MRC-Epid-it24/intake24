import { AppLoader } from '@/loaders/loader';
import api from './api';
import admin from './admin';
import docs from './docs';
import survey from './survey';

export default ({ app }: AppLoader): void => {
  app.use('/api', api);

  app.use('/admin', admin);
  app.use('/docs', docs);
  app.use(survey);
};
