export interface AuthenticationConfig {
  jwt: {
    access: {
      secret: string;
      lifetime: string;
    };
    refresh: {
      secret: string;
      lifetime: string;
    };
    cookie: {
      name: string;
      maxAge: number | string;
      httpOnly: boolean;
      path: string;
      sameSite: boolean | 'lax' | 'strict' | 'none';
      secure: boolean;
    };
  };
}

const authenticationConfig: AuthenticationConfig = {
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET ?? '',
      lifetime: process.env.JWT_LIFETIME ?? '15m',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET ?? '',
      lifetime: process.env.JWT_REFRESH_LIFETIME ?? '1d',
    },
    cookie: {
      name: 'it24_refresh_token',
      maxAge: process.env.JWT_REFRESH_LIFETIME ?? '1d',
      httpOnly: true,
      path: '/refresh',
      sameSite: 'lax',
      secure: process.env.JWT_SECURE_COOKIE === 'true',
    },
  },
};

export default authenticationConfig;
