import express, { Express } from 'express';
import loaders from '@/loaders';

export default async (): Promise<Express> => {
  // Init express
  const app = express();

  // Load dependencies
  await loaders({ app });

  return app;
};
