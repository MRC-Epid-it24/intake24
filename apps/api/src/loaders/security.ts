import type { Express } from 'express';
import cors from 'cors';

import type { Ops } from '@intake24/api/app';

export default async (app: Express, { config }: Ops): Promise<void> => {
  const {
    cors: { origin },
    proxy,
  } = config.security;

  // X-powered-by header
  app.disable('x-powered-by');

  // Trusted proxies
  app.set('trust proxy', proxy);

  // E-tags
  app.set('etag', false);

  // CORS
  app.use(
    cors({
      origin,
      credentials: true,
      exposedHeaders: ['RateLimit', 'RateLimit-Policy', 'Retry-After'],
    })
  );
};
