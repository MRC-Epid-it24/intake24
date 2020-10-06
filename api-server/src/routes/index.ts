import { AppLoader } from '@/loaders/loader';
import api from './api';
import survey from './survey';

export default ({ app }: AppLoader): void => {
  app.use('/api', api);

  app.use(survey);
};
