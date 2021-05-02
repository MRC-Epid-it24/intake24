import { OmitAndOptional, Optional } from '../model';

export type SurveySubmissionAttributes = {
  id: string;
  surveyId: string;
  userId: number;
  startTime: Date;
  endTime: Date;
  submissionTime: Date;
  log: string[] | null;
  uxSessionId: string;
};

export type SurveySubmissionCreationAttributes = Optional<SurveySubmissionAttributes, 'log'>;

export type SurveySubmissionCustomFieldAttributes = {
  id: number;
  surveySubmissionId: string;
  name: string;
  value: string;
};

export type SurveySubmissionCustomFieldCreationAttributes = Omit<
  SurveySubmissionCustomFieldAttributes,
  'id'
>;

export type SurveySubmissionMealAttributes = {
  id: number;
  surveySubmissionId: string;
  hours: number;
  minutes: number;
  name: string | null;
};

export type SurveySubmissionMealCreationAttributes = Omit<SurveySubmissionMealAttributes, 'id'>;

export type SurveySubmissionMealCustomFieldAttributes = {
  id: number;
  mealId: number;
  name: string;
  value: string;
};

export type SurveySubmissionMealCustomFieldCreationAttributes = Omit<
  SurveySubmissionMealCustomFieldAttributes,
  'id'
>;

export type SurveySubmissionFoodAttributes = {
  id: number;
  mealId: number;
  code: string;
  englishDescription: string;
  localDescription: string | null;
  readyMeal: boolean;
  searchTerm: string;
  portionSizeMethodId: string;
  reasonableAmount: boolean;
  foodGroupId: number;
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
  id: number;
  foodId: number;
  name: string;
  value: string;
};

export type SurveySubmissionFoodCustomFieldCreationAttributes = Omit<
  SurveySubmissionFoodCustomFieldAttributes,
  'id'
>;

export type SurveySubmissionMissingFoodAttributes = {
  id: number;
  mealId: number;
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
  id: number;
  foodId: number;
  fieldName: string;
  value: string;
};

export type SurveySubmissionFieldCreationAttributes = Omit<SurveySubmissionFieldAttributes, 'id'>;

export type SurveySubmissionNutrientAttributes = {
  id: number;
  foodId: number;
  amount: number;
  nutrientTypeId: number;
};

export type SurveySubmissionNutrientCreationAttributes = Omit<
  SurveySubmissionNutrientAttributes,
  'id'
>;

export type SurveySubmissionPortionSizeFieldAttributes = {
  id: number;
  foodId: number;
  name: string;
  value: string;
};

export type SurveySubmissionPortionSizeFieldCreationAttributes = Omit<
  SurveySubmissionPortionSizeFieldAttributes,
  'id'
>;
