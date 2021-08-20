import { OmitAndOptional, Optional } from '../model';

export type SurveySubmissionAttributes = {
  id: string;
  surveyId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  submissionTime: Date;
  log: string | null;
  uxSessionId: string;
};

export type SurveySubmissionCreationAttributes = Optional<SurveySubmissionAttributes, 'log'>;

export type SurveySubmissionCustomFieldAttributes = {
  id: string;
  surveySubmissionId: string;
  name: string;
  value: string;
};

export type SurveySubmissionCustomFieldCreationAttributes = Omit<
  SurveySubmissionCustomFieldAttributes,
  'id'
>;

export type SurveySubmissionMealAttributes = {
  id: string;
  surveySubmissionId: string;
  hours: number;
  minutes: number;
  name: string | null;
};

export type SurveySubmissionMealCreationAttributes = Omit<SurveySubmissionMealAttributes, 'id'>;

export type SurveySubmissionMealCustomFieldAttributes = {
  id: string;
  mealId: string;
  name: string;
  value: string;
};

export type SurveySubmissionMealCustomFieldCreationAttributes = Omit<
  SurveySubmissionMealCustomFieldAttributes,
  'id'
>;

export type SurveySubmissionFoodAttributes = {
  id: string;
  mealId: string;
  code: string;
  englishDescription: string;
  localDescription: string | null;
  readyMeal: boolean;
  searchTerm: string;
  portionSizeMethodId: string;
  reasonableAmount: boolean;
  foodGroupId: string;
  foodGroupEnglishDescription: string;
  foodGroupLocalDescription: string | null;
  brand: string;
  nutrientTableId: string;
  nutrientTableCode: string;
};

export type SurveySubmissionFoodCreationAttributes = OmitAndOptional<
  SurveySubmissionFoodAttributes,
  'id',
  'localDescription' | 'foodGroupLocalDescription'
>;

export type SurveySubmissionFoodCustomFieldAttributes = {
  id: string;
  foodId: string;
  name: string;
  value: string;
};

export type SurveySubmissionFoodCustomFieldCreationAttributes = Omit<
  SurveySubmissionFoodCustomFieldAttributes,
  'id'
>;

export type SurveySubmissionMissingFoodAttributes = {
  id: string;
  mealId: string;
  name: string;
  brand: string;
  description: string;
  portionSize: string;
  leftovers: string;
};

export type SurveySubmissionMissingFoodCreationAttributes = Omit<
  SurveySubmissionMissingFoodAttributes,
  'id'
>;

export type SurveySubmissionFieldAttributes = {
  id: string;
  foodId: string;
  fieldName: string;
  value: string;
};

export type SurveySubmissionFieldCreationAttributes = Omit<SurveySubmissionFieldAttributes, 'id'>;

export type SurveySubmissionNutrientAttributes = {
  id: string;
  foodId: string;
  amount: number;
  nutrientTypeId: string;
};

export type SurveySubmissionNutrientCreationAttributes = Omit<
  SurveySubmissionNutrientAttributes,
  'id'
>;

export type SurveySubmissionPortionSizeFieldAttributes = {
  id: string;
  foodId: string;
  name: string;
  value: string;
};

export type SurveySubmissionPortionSizeFieldCreationAttributes = Omit<
  SurveySubmissionPortionSizeFieldAttributes,
  'id'
>;
