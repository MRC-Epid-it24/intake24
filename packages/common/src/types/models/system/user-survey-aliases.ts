export type UserSurveyAliasAttributes = {
  id: string;
  userId: string;
  surveyId: string;
  username: string;
  urlAuthToken: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSurveyAliasCreationAttributes = Omit<
  UserSurveyAliasAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
