export type EmailLoginRequest = {
  email: string;
  password: string;
};

export type AliasLoginRequest = {
  username: string;
  password: string;
  survey: string;
};

export type TokenLoginRequest = {
  token: string;
};

export type MFAVerifyRequest = { code: string; state: string };

export type LoginResponse = {
  accessToken: string;
};

export type MFAResponse = {
  mfaRequestUrl: string;
};

export type RefreshResponse = LoginResponse;
