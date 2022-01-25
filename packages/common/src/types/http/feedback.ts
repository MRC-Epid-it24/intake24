import { FoodGroupFeedbackAttributes } from '../models/foods/food-groups-feedback';
import {
  DemographicGroupAttributes,
  DemographicGroupScaleSectorAttributes,
  FiveADayFeedbackAttributes,
  PhysicalActivityLevelAttributes,
} from '../models/foods';
import { NutrientTypeInKcalAttributes } from '../models/system';
import { HenryCoefficient, WeightTargetCoefficient } from '../../feedback';

export interface DemographicGroup extends DemographicGroupAttributes {
  nutrientTypeInKcal?: NutrientTypeInKcalAttributes;
  scaleSectors: DemographicGroupScaleSectorAttributes[];
}

export type FiveADayFeedback = FiveADayFeedbackAttributes;

export interface FoodGroupFeedback extends FoodGroupFeedbackAttributes {
  nutrients: string[];
}

export type NutrientType = {
  id: string;
  description: string;
  unit: string;
};

export type PhysicalActivityLevel = PhysicalActivityLevelAttributes;

export type FeedbackData = {
  demographicGroups: DemographicGroup[];
  fiveADay: FiveADayFeedback;
  foodGroups: FoodGroupFeedback[];
  henryCoefficients: HenryCoefficient[];
  nutrientTypes: NutrientType[];
  physicalActivityLevels: PhysicalActivityLevel[];
  weightTargets: WeightTargetCoefficient[];
};
