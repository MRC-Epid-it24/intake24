import Recall from '@/util/Recall';
import { Dictionary } from '@common/types';
import { SurveyParametersResponse } from '@common/types/http';
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
  survey: SurveyParametersResponse | null;
  user: Dictionary | null;
}
