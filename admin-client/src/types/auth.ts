export interface JwtPayload {
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  roles: string[];
  sub: string;
  type: string;
  userId: number;
}

export type SubjectProvider = 'email' | 'surveyAlias' | 'URLToken';

export interface Subject {
  providerID: SubjectProvider;
  providerKey: string;
}

export interface UserPayload {
  userId: number;
  provider: Subject;
  roles: string[];
}

export const ACCESS_TOKEN = 'access_token';
