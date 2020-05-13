import { Express } from 'express';

export interface AppLoader {
  app: Express;
  env?: string;
}
