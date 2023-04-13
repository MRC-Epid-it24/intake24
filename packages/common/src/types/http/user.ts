import type {
  SurveySubmissionAttributes,
  SurveySubmissionCustomFieldAttributes,
  SurveySubmissionFoodAttributes,
  SurveySubmissionFoodCustomFieldAttributes,
  SurveySubmissionMealAttributes,
  SurveySubmissionMealCustomFieldAttributes,
  SurveySubmissionNutrientAttributes,
  SurveySubmissionPortionSizeFieldAttributes,
  UserAttributes,
  UserPhysicalDataAttributes,
} from '@intake24/db';

export interface SurveySubmissionFoodEntry extends SurveySubmissionFoodAttributes {
  meal: SurveySubmissionMealAttributes;
  customFields: SurveySubmissionFoodCustomFieldAttributes[];
  nutrients: SurveySubmissionNutrientAttributes[];
  portionSizes: SurveySubmissionPortionSizeFieldAttributes[];
}

export interface SurveySubmissionMealEntry extends SurveySubmissionMealAttributes {
  submission: SurveySubmissionAttributes;
  customFields: SurveySubmissionMealCustomFieldAttributes[];
  foods: SurveySubmissionFoodEntry[];
}

export interface SurveySubmissionEntry extends SurveySubmissionAttributes {
  user: UserAttributes;
  customFields: SurveySubmissionCustomFieldAttributes[];
  meals: SurveySubmissionMealEntry[];
}

export type SurveySubmissions = SurveySubmissionEntry[];

export type UserPhysicalDataResponse = UserPhysicalDataAttributes | null;
