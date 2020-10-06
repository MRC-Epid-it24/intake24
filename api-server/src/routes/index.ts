import { AppLoader } from '@/loaders/loader';
import api from './api';

export default ({ app }: AppLoader): void => {
  app.use('/api', api);
};
