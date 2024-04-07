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
            defaultSrc: ['\'self\''],
            connectSrc: [
              '\'self\'',
              'https://*.google-analytics.com',
              'https://*.analytics.google.com',
              'https://*.googletagmanager.com',
            ],
            frameSrc: [
              '\'self\'',
              'https://www.google.com',
              'https://youtube.com',
              'https://www.youtube.com',
            ],
            imgSrc: [
              '\'self\'',
              'blob:',
              'data:',
              'https://*.google-analytics.com',
              'https://*.googletagmanager.com',
            ],
            scriptSrc: [
              '\'self\'',
              'https://storage.googleapis.com',
              'https://*.googletagmanager.com',
            ],
          },
        },
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
      }),
    );
  }

  app.use(express.static(config.filesystem.local.public, { index: false }));

  app.use(site);
};
