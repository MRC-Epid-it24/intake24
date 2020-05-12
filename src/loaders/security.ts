import helmet from 'helmet';
import { AppLoader } from './loader';

export default async ({ app }: AppLoader): Promise<void> => {
  app.use(helmet());
};
