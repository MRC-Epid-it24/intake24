import cors from 'cors';
import helmet from 'helmet';
import config from '@/config/security';
import { AppLoader } from './loader';

const { origin } = config.cors;

export default async ({ app }: AppLoader): Promise<void> => {
  app.use(cors({ origin, credentials: true }));

  app.use(helmet());
};
