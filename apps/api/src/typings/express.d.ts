import type { AwilixContainer } from 'awilix';

import type { RequestIoC } from '@intake24/api/ioc';
import type { MFAProvider } from '@intake24/common/security';

declare global {
  namespace Express {
    export interface Request {
      scope: AwilixContainer<RequestIoC>;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    mfaAuthChallenge: {
      challengeId: string;
      deviceId: string;
      provider: MFAProvider;
      userId: string;
    };
    duoRegChallenge: {
      challengeId: string;
    };
    fidoRegChallenge: {
      challengeId: string;
    };
    otpRegChallenge: {
      challengeId: string;
      secret: string;
    };
  }
}
