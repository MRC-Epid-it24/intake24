import { Dictionary } from '@common/types';
import { UserPayload } from './auth';

export interface RootState {
  lang: string;
  app: {
    api: string;
    host: string;
    name: string;
    build: {
      version: string;
      revision: string;
      date: string;
    };
  };
}

export interface LoadingState {
  items: string[];
}

export interface UserState {
  status: string;
  payload: UserPayload;
  profile: any;
  permissions: string[];
  roles: string[];
}

export interface Permission {
  resource?: string;
  action?: string;
}

export interface AuthState {
  accessToken: string | null;
  mfa: { request: string; host: string } | null;
  status: string;
  error: Dictionary;
}

export interface EntryState {
  status: string;
  data: Dictionary;
  refs: Dictionary;
  addons: Dictionary;
  error: Dictionary;
}

export interface ListState {
  name: string;
  status: string;
  data: Dictionary[];
  refs: Dictionary;
  filter: Dictionary;
  error: Dictionary;
}
