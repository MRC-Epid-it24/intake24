import type { RedisOptions } from 'ioredis';
import ms from 'ms';

import type { CookieSettings, SameSiteCookieOptions } from './common';

export type SessionConfig = {
  redis: RedisOptions;
  cookie: CookieSettings;
};

const sessionConfig: SessionConfig = {
  redis: {
    host: process.env.SESSION_REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.SESSION_REDIS_PORT || '6379', 10),
    keyPrefix: process.env.SESSION_REDIS_PREFIX || 'it24:session:',
  },
  cookie: {
    name: process.env.SESSION_COOKIE_NAME || 'it24_session',
    maxAge: ms(process.env.SESSION_COOKIE_LIFETIME || '15m'),
    httpOnly: true,
    path: process.env.SESSION_COOKIE_PATH || '/api/admin',
    sameSite: (process.env.SESSION_COOKIE_SAME_SITE || 'lax') as SameSiteCookieOptions,
    secure: process.env.SESSION_COOKIE_SECURE === 'true',
  },
};

export default sessionConfig;
