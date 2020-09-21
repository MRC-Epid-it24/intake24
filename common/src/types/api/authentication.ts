export type LoginResponse = {
  accessToken: string;
};

export type MfaResponse = {
  mfa: {
    request: string;
    host: string;
  };
};

export type RefreshResponse = LoginResponse;
