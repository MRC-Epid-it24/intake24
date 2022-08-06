import ms from 'ms';

import type { MFAProvider } from '@intake24/common/security';

import type { CookieSettings, SameSiteCookieOptions } from './common';

export type JwtTokenSettings = {
  secret: string;
  lifetime: string;
  audience: string[];
};

export type JwtFrontEndSettings = {
  access: Omit<JwtTokenSettings, 'secret'>;
  refresh: JwtTokenSettings;
  cookie: CookieSettings;
};

export type JwtAuthentication = {
  issuer: string;
  secret: string;
  admin: JwtFrontEndSettings;
  survey: JwtFrontEndSettings;
};

export type DuoProvider = {
  clientId: string;
  clientSecret: string;
  apiHost: string;
  redirectUrl: string;
};

export type MultiFactorAuthentication = {
  enabled: boolean;
  provider: MFAProvider;
  providers: {
    duo: DuoProvider;
  };
};

export type PasswordsConfig = {
  expiresIn: number;
};

export type AuthTokensConfig = {
  size: number;
  alphabet: string | null;
};

export type SignInLogConfig = {
  enabled: boolean;
};

export interface SecurityConfig {
  cors: {
    origin: boolean | string | string[];
  };
  proxy: string[] | boolean;
  jwt: JwtAuthentication;
  mfa: MultiFactorAuthentication;
  passwords: PasswordsConfig;
  authTokens: AuthTokensConfig;
  signInLog: SignInLogConfig;
}

const securityConfig: SecurityConfig = {
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : false,
  },
  proxy: process.env.PROXY ? process.env.PROXY.split(',') : false,
  jwt: {
    issuer: process.env.JWT_ISSUER ?? 'intake24',
    secret: process.env.JWT_ACCESS_SECRET ?? '',
    admin: {
      access: {
        audience: ['admin', 'access'],
        lifetime: process.env.JWT_ADMIN_ACCESS_LIFETIME || '15m',
      },
      refresh: {
        audience: ['admin', 'refresh'],
        secret: process.env.JWT_ADMIN_REFRESH_SECRET ?? '',
        lifetime: process.env.JWT_ADMIN_REFRESH_LIFETIME || '1d',
      },
      cookie: {
        name: 'it24a_refresh_token',
        maxAge: ms(process.env.JWT_ADMIN_REFRESH_LIFETIME || '1d'),
        httpOnly: true,
        path: process.env.JWT_ADMIN_COOKIE_PATH || '/api/admin/auth',
        sameSite: (process.env.JWT_ADMIN_COOKIE_SAMESITE || 'lax') as SameSiteCookieOptions,
        secure: process.env.JWT_ADMIN_COOKIE_SECURE === 'true',
      },
    },
    survey: {
      access: {
        audience: ['survey', 'access'],
        lifetime: process.env.JWT_SURVEY_ACCESS_LIFETIME || '15m',
      },
      refresh: {
        audience: ['survey', 'refresh'],
        secret: process.env.JWT_SURVEY_REFRESH_SECRET ?? '',
        lifetime: process.env.JWT_SURVEY_REFRESH_LIFETIME || '1d',
      },
      cookie: {
        name: 'it24s_refresh_token',
        maxAge: ms(process.env.JWT_SURVEY_REFRESH_LIFETIME || '1d'),
        httpOnly: true,
        path: process.env.JWT_SURVEY_COOKIE_PATH || '/api/auth',
        sameSite: (process.env.JWT_SURVEY_COOKIE_SAMESITE || 'lax') as SameSiteCookieOptions,
        secure: process.env.JWT_SURVEY_COOKIE_SECURE === 'true',
      },
    },
  },
  mfa: {
    enabled: process.env.MFA_ENABLED === 'true',
    provider: process.env.MFA_PROVIDER as MFAProvider,
    providers: {
      duo: {
        clientId: process.env.DUO_CLIENT_ID || '',
        clientSecret: process.env.DUO_CLIENT_SECRET || '',
        apiHost: process.env.DUO_API_HOST || '',
        redirectUrl: process.env.DUO_REDIRECT_URL || '',
      },
    },
  },
  passwords: {
    expiresIn: ms(process.env.PASSWORDS_EXPIRES_IN || '1h'),
  },
  authTokens: {
    size: parseInt(process.env.AUTH_TOKENS_SIZE || '21', 10),
    alphabet: process.env.AUTH_TOKENS_ALPHABET || null,
  },
  signInLog: {
    enabled: !process.env.SIGN_IN_LOG_ENABLED || process.env.SIGN_IN_LOG_ENABLED === 'true',
  },
};

export default securityConfig;
