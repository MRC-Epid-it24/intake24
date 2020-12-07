import cors from 'cors';
import { Express, Response } from 'express';
import helmet from 'helmet';
import { nanoid } from 'nanoid';
import type { Ops } from '@/app';

export default async (app: Express, { config }: Ops): Promise<void> => {
  const { origin } = config.security.cors;

  app.set('trust proxy', 1);

  app.use(cors({ origin, credentials: true }));

  app.use((req, res, next) => {
    res.locals.nonce = { recaptcha: nanoid() };
    next();
  });

  // Security HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
          frameSrc: ["'self'", 'https://www.google.com', 'https://*.duosecurity.com'],
          imgSrc: ["'self'", 'blob:', 'data:'],
          scriptSrc: [
            "'self'",
            'https://storage.googleapis.com',
            (req, res) => `'nonce-${(res as Response).locals.nonce.recaptcha}'`,
          ],
          styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        },
      },
    })
  );
};
