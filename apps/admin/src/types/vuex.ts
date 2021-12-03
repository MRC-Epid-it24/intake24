import { Dictionary } from '@common/types';
import { AxiosError } from 'axios';

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
  mfaRequestUrl: string | null;
  error: AxiosError | null;
}

export interface EntryState {
  status: string;
  data: Dictionary;
  refs: Dictionary;
  addons: Dictionary;
  error: AxiosError | null;
}

export interface ListState {
  name: string;
  status: string;
  data: Dictionary[];
  refs: Dictionary;
  filter: Dictionary;
  error: AxiosError | null;
}
