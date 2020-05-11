import { Application } from 'express';

export interface AppLoader {
  app: Application;
  env?: string;
}
