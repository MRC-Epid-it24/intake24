export type SameSiteCookieOptions = boolean | 'lax' | 'strict' | 'none';

export type CookieSettings = {
  name: string;
  maxAge: number;
  httpOnly: boolean;
  path: string;
  sameSite: SameSiteCookieOptions;
  secure: boolean;
};
