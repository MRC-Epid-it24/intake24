import type { WeightTargetCoefficient } from '../../feedback';
import type { PhysicalActivityLevelAttributes } from '../models/foods';

export type NutrientType = {
  id: string;
  description: string;
  unit: string;
  kcalPerUnit: number | null;
};

export type PhysicalActivityLevel = PhysicalActivityLevelAttributes;

export type FeedbackData = {
  nutrientTypes: NutrientType[];
  physicalActivityLevels: PhysicalActivityLevel[];
  weightTargets: WeightTargetCoefficient[];
};
