import { AnyDictionary } from '@common/types/common';
import { UserPayload } from './auth';

export interface RootState {
  lang: string;
  module?: string | null;
}

export interface LoadingState {
  items: string[];
}

export interface UserState {
  status: string;
  profile: UserPayload;
}

export interface AuthState {
  accessToken: string | null;
  mfa: { request: string; host: string } | null;
  status: string;
  error: object;
}

export interface EntryState {
  name: string;
  status: string;
  data: AnyDictionary;
  refs: AnyDictionary;
  addons: AnyDictionary;
  error: AnyDictionary;
}

export interface ListState {
  name: string;
  status: string;
  data: AnyDictionary[];
  refs: AnyDictionary;
  error: AnyDictionary;
}

export interface FilterState {
  name: string;
  key: string;
  data: AnyDictionary;
}
