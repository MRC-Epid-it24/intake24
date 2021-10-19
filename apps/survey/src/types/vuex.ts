import { FoodState, MealState, SurveyState as CurrentSurveyState } from '@common/types';
import { SurveyEntryResponse, SurveyUserInfoResponse } from '@common/types/http';
import { AxiosError } from 'axios';
import { UserPayload } from './auth';

export interface AuthState {
  status: string;
  accessToken: string | null;
  error: AxiosError | null;
}

export interface LoadingState {
  items: string[];
}

export interface MealUndo {
  type: 'meal';
  index: number;
  value: MealState;
}

export interface FoodUndo {
  type: 'food';
  index: number;
  mealIndex: number;
  value: FoodState;
}

export type SurveyStateSnapshot = {
  timestamp: Date;
  data: CurrentSurveyState;
};

export interface SurveyState {
  parameters: SurveyEntryResponse | null;
  user: SurveyUserInfoResponse | null;
  data: CurrentSurveyState;
  history: SurveyStateSnapshot[];
  undo: MealUndo | FoodUndo | null;
  error: AxiosError | null;
}

export interface UserState {
  status: string;
  profile: UserPayload;
}

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

export interface Modules {
  auth: AuthState;
  loading: LoadingState;
  survey: SurveyState;
  user: UserState;
}

export type RootStateWithModules = RootState & Modules;
