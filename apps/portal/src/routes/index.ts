import type { Express } from 'express';
import express from 'express';
import helmet from 'helmet';

import type { Ops } from '../app';
import site from './site';

export default (app: Express, { config }: Ops): void => {
  if (config.app.env === 'production') {
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
  }

  app.use(express.static(config.filesystem.local.public, { index: false }));

  app.use(site);
};
