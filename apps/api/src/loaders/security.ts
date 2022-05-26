import cors from 'cors';
import type { Express } from 'express';
import type { Ops } from '@intake24/api/app';

export default async (app: Express, { config }: Ops): Promise<void> => {
  const {
    cors: { origin },
    proxy,
  } = config.security;

  // Trusted proxies
  app.set('trust proxy', proxy);
  app.set('etag', false);

  // CORS
  app.use(cors({ origin, credentials: true }));
};
