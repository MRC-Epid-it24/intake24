import { Dictionary } from '@common/types';
import { UserPayload } from './auth';

export interface RootState {
  lang: string;
  module?: string | null;
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
  module?: string;
  action?: string;
}

export interface AuthState {
  accessToken: string | null;
  mfa: { request: string; host: string } | null;
  status: string;
  error: Dictionary;
}

export interface EntryState {
  name: string;
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
  error: Dictionary;
}

export interface FilterState {
  name: string;
  key: string;
  data: Dictionary;
}
