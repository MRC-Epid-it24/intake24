import type { SurveyState } from '../../recall';

export type UserSession = {
  userId: number;
  surveyId: string;
  sessionData: SurveyState;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSessionCreateAttributes = Omit<UserSession, 'createdAt' | 'updatedAt'>;
