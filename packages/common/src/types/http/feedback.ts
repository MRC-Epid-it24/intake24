import {
  DemographicGroupAttributes,
  DemographicGroupScaleSectorAttributes,
  PhysicalActivityLevelAttributes,
} from '../models/foods';
import { NutrientTypeInKcalAttributes } from '../models/system';
import { WeightTargetCoefficient } from '../../feedback';

export interface DemographicGroup extends DemographicGroupAttributes {
  nutrientTypeInKcal?: NutrientTypeInKcalAttributes;
  scaleSectors: DemographicGroupScaleSectorAttributes[];
}

export type NutrientType = {
  id: string;
  description: string;
  unit: string;
};

export type PhysicalActivityLevel = PhysicalActivityLevelAttributes;

export type FeedbackData = {
  demographicGroups: DemographicGroup[];
  nutrientTypes: NutrientType[];
  physicalActivityLevels: PhysicalActivityLevel[];
  weightTargets: WeightTargetCoefficient[];
};
