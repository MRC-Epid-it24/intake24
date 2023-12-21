export type SameSiteCookieOptions = 'strict' | 'lax' | 'none';

export type CookieSettings = {
  name: string;
  maxAge: number;
  httpOnly: boolean;
  path: string;
  sameSite: SameSiteCookieOptions;
  secure: boolean;
};
