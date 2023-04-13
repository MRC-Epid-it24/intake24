import type { PhysicalActivityLevelAttributes } from '@intake24/db';

import type { WeightTargetCoefficient } from '../../feedback';

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
