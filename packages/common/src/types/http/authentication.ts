export type LoginResponse = {
  accessToken: string;
};

export type MFAResponse = {
  mfaRequestUrl: string;
};

export type RefreshResponse = LoginResponse;
