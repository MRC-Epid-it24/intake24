import type { MFAProvider } from './mfa';

export type SubjectProvider = 'email' | 'surveyAlias' | 'URLToken';

export type Subject = {
  provider: SubjectProvider | MFAProvider;
  providerKey: string;
};

export type SignPayload = {
  userId: string;
};

export interface TokenPayload extends SignPayload {
  sub: string;
  jti: string;
  aud: string[];
  iss: string;
  iat: number;
  exp: number;
}
