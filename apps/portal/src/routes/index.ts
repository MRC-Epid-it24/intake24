import express, { Express } from 'express';
import helmet from 'helmet';
import type { Ops } from '../app';
import site from './site';

export default (app: Express, { config }: Ops): void => {
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
          ],
          imgSrc: ["'self'", 'blob:', 'data:'],
          scriptSrc: ["'self'", 'https://storage.googleapis.com'],
          styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );

  app.use(express.static(config.app.public, { index: false }));

  app.use(site);
};
