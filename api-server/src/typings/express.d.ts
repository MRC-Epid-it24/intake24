import type { AwilixContainer } from 'awilix';
import type { IoC } from '@/ioc';

declare global {
  namespace Express {
    export interface Request {
      scope: AwilixContainer<IoC>;
    }
  }
}
