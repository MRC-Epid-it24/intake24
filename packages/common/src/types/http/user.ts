import type { UserAttributes, SurveySubmissionAttributes } from '@intake24/common/types/models';
import type {
  SurveySubmissionPortionSizeFieldAttributes,
  SurveySubmissionNutrientAttributes,
  SurveySubmissionFoodAttributes,
  SurveySubmissionFoodCustomFieldAttributes,
  SurveySubmissionMealCustomFieldAttributes,
  SurveySubmissionCustomFieldAttributes,
  SurveySubmissionMealAttributes,
  UserPhysicalDataAttributes,
} from '../models/system';

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
