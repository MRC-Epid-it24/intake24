import cors from 'cors';
import helmet from 'helmet';
import config from '@/config/security';
import { AppLoader } from './loader';

const { origin } = config.cors;

export default async ({ app }: AppLoader): Promise<void> => {
  app.set('trust proxy', 1);

  app.use(cors({ origin, credentials: true }));

  // Security HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'blob:', 'data:'],
          scriptSrc: ["'self'", 'https://storage.googleapis.com'],
          styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        },
      },
    })
  );
};
