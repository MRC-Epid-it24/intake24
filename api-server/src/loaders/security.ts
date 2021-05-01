import cors from 'cors';
import { Express } from 'express';
import helmet from 'helmet';
import type { Ops } from '@/app';

export default async (app: Express, { config }: Ops): Promise<void> => {
  const { origin } = config.security.cors;

  app.set('trust proxy', 1);

  app.use(cors({ origin, credentials: true }));

  // Security HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
          frameSrc: [
            "'self'",
            'https://www.google.com',
            'https://youtube.com',
            'https://www.youtube.com',
            'https://*.duosecurity.com',
          ],
          imgSrc: ["'self'", 'blob:', 'data:'],
          scriptSrc: [
            "'self'",
            'https://storage.googleapis.com',
            'https://www.google.com/recaptcha/',
            'https://www.gstatic.com/recaptcha/',
          ],
          styleSrc: [
            "'self'",
            'https://fonts.googleapis.com',
            'https://www.google.com/recaptcha/',
            'https://recaptcha.google.com/recaptcha/',
            "'unsafe-inline'", // TODO: review for Vuetify theming
          ],
        },
      },
    })
  );
};
