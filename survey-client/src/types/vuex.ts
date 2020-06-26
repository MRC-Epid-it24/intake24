import { UserPayload } from './auth';

export interface RootState {
  lang: string;
}

export interface LoadingState {
  items: string[];
}

export interface UserState {
  status: string;
  profile: UserPayload;
}

export interface AuthState {
  status: string;
  accessToken: string | null;
  error: object;
}
