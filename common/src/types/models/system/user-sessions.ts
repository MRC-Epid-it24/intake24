import type { SurveyState } from '../../recall';

export type UserSessionAttributes = {
  userId: number;
  surveyId: string;
  sessionData: SurveyState;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSessionCreationAttributes = Omit<UserSessionAttributes, 'createdAt' | 'updatedAt'>;
