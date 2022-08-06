import type { AwilixContainer } from 'awilix';

import type { RequestIoC } from '@intake24/api/ioc';

declare global {
  namespace Express {
    export interface Request {
      scope: AwilixContainer<RequestIoC>;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    duo: {
      state: string;
      email: string;
    };
  }
}
