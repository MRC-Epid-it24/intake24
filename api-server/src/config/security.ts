export type JwtTokenSettings = {
  secret: string;
  lifetime: string;
};

export type SameSiteCookieOptions = boolean | 'lax' | 'strict' | 'none';

export type JwtCookieSettings = {
  name: string;
  maxAge: number | string;
  httpOnly: boolean;
  path: string;
  sameSite: SameSiteCookieOptions;
  secure: boolean;
};

export type JwtAuthentication = {
  issuer: string;
  access: JwtTokenSettings;
  refresh: JwtTokenSettings;
  cookie: JwtCookieSettings;
};

export type MFAProvider = 'duo';

export type DuoProvider = {
  ikey: string;
  skey: string;
  akey: string;
  host: string;
};

export type MultiFactorAuthentication = {
  enabled: boolean;
  provider: MFAProvider;
  providers: {
    duo: DuoProvider;
  };
};

export type PasswordsConfig = {
  expire: number;
  throttle: number;
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
      lifetime: process.env.JWT_ACCESS_LIFETIME ?? '15m',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET ?? '',
      lifetime: process.env.JWT_REFRESH_LIFETIME ?? '1d',
    },
    cookie: {
      name: 'it24_refresh_token',
      maxAge: process.env.JWT_REFRESH_LIFETIME ?? '1d',
      httpOnly: true,
      path: process.env.JWT_COOKIE_PATH ?? '/api/auth',
      sameSite: (process.env.JWT_COOKIE_SAMESITE ?? 'lax') as SameSiteCookieOptions,
      secure: process.env.JWT_COOKIE_SECURE === 'true',
    },
  },
  mfa: {
    enabled: process.env.MFA_ENABLED === 'true',
    provider: process.env.MFA_PROVIDER as MFAProvider,
    providers: {
      duo: {
        ikey: process.env.DUO_IKEY ?? '',
        skey: process.env.DUO_SKEY ?? '',
        akey: process.env.DUO_AKEY ?? '',
        host: process.env.DUO_HOST ?? '',
      },
    },
  },
  passwords: {
    expire: 60,
    throttle: 60,
  },
  authTokens: {
    size: 21,
    alphabet: null,
  },
  signInLog: {
    enabled: true,
  },
};

export default securityConfig;
