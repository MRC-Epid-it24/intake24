import type { SurveyState } from '../../recall';

export type UserSurveySessionAttributes = {
  userId: string;
  surveyId: string;
  sessionData: SurveyState;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSurveySessionCreationAttributes = Omit<
  UserSurveySessionAttributes,
  'createdAt' | 'updatedAt'
>;
