import { Dictionary, FoodState, MealState, SurveyState as CurrentSurveyState } from '@common/types';
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
export interface SurveyState {
  parameters: SurveyEntryResponse | null;
  user: SurveyUserInfoResponse | null;
  data: CurrentSurveyState | null;
  undo: MealUndo | FoodUndo | null;
}
