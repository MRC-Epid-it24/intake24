import type { LoginMeta, Tokens } from '..';

export type MFALoginCredentials = {
  email: string;
  userId: string;
};

export type MFAVerifyCredentials = {
  code: string;
  state: string;
};

export type MFARequest = { mfaRequestUrl: string };

export interface MFAProvider {
  request: (credentials: MFALoginCredentials, meta: LoginMeta) => Promise<MFARequest>;
  verify: (credentials: MFAVerifyCredentials, meta: LoginMeta) => Promise<Tokens>;
}
