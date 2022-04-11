import type { MFAProvider } from '@intake24/common/security';
import ms from 'ms';
import type { CookieSettings, SameSiteCookieOptions } from './common';

export type JwtTokenSettings = {
  secret: string;
  lifetime: string;
};

export type JwtAuthentication = {
  issuer: string;
  access: JwtTokenSettings;
  refresh: JwtTokenSettings;
  cookie: CookieSettings;
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
    issuer: 'intake24',
    access: {
      secret: process.env.JWT_ACCESS_SECRET ?? '',
      lifetime: process.env.JWT_ACCESS_LIFETIME || '15m',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET ?? '',
      lifetime: process.env.JWT_REFRESH_LIFETIME || '1d',
    },
    cookie: {
      name: 'it24_refresh_token',
      maxAge: ms(process.env.JWT_REFRESH_LIFETIME || '1d'),
      httpOnly: true,
      path: process.env.JWT_COOKIE_PATH || '/api/auth',
      sameSite: (process.env.JWT_COOKIE_SAMESITE || 'lax') as SameSiteCookieOptions,
      secure: process.env.JWT_COOKIE_SECURE === 'true',
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
