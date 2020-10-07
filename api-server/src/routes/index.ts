import { AppLoader } from '@/loaders/loader';
import api from './api';
import docs from './docs';
import survey from './survey';

export default ({ app }: AppLoader): void => {
  app.use('/api', api);

  app.use('/docs', docs);
  app.use(survey);
};
