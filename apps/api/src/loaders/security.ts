import cors from 'cors';
import { Express } from 'express';
import type { Ops } from '@intake24/api/app';

export default async (app: Express, { config }: Ops): Promise<void> => {
  const {
    cors: { origin },
    proxy,
  } = config.security;

  // Trusted proxies
  app.set('trust proxy', proxy);

  // CORS
  app.use(cors({ origin, credentials: true }));
};
