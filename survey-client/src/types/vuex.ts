import { Dictionary, RecallState as CurrentRecallState } from '@common/types';
import { SurveyEntryResponse, SurveyUserInfoResponse } from '@common/types/http';
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
  profile: UserPayload;
}

export interface AuthState {
  status: string;
  accessToken: string | null;
  error: Dictionary;
}

export interface RecallState {
  survey: SurveyEntryResponse | null;
  user: SurveyUserInfoResponse | null;
  state: CurrentRecallState | null;
}
