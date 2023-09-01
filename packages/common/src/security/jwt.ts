import type { MFAProvider } from './mfa';

export type SubjectProvider = 'email' | 'surveyAlias' | 'URLToken';

export type Subject = {
  provider: SubjectProvider | MFAProvider;
  providerKey: string;
};

export type AdminSignPayload = {
  userId: string;
};

export type SurveySignPayload = {
  surveyId: string;
  userId: string;
};

export type SignPayload = AdminSignPayload | SurveySignPayload;

export type AdminTokenPayload = AdminSignPayload & {
  sub: string;
  jti: string;
  aud: string[];
  iss: string;
  iat: number;
  exp: number;
};

export type SurveyTokenPayload = SurveySignPayload & {
  sub: string;
  jti: string;
  aud: string[];
  iss: string;
  iat: number;
  exp: number;
};

export type TokenPayload = AdminTokenPayload | SurveyTokenPayload;
