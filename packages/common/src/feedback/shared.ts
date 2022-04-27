export const feedbackTypes = ['default', 'playful'] as const;
export type FeedbackType = typeof feedbackTypes[number];

export const feedbackOutputs = ['download', 'email', 'print'] as const;
export type FeedbackOutput = typeof feedbackOutputs[number];

export const nutrientRuleTypes = [
  'energy_divided_by_bmr',
  'percentage_of_energy',
  'per_unit_of_weight',
  'range',
] as const;
export type NutrientRuleType = typeof nutrientRuleTypes[number];

export type Range = {
  start: number;
  end: number;
};

export const sentiments = [
  'too_low',
  'low',
  'bit_low',
  'good',
  'excellent',
  'high',
  'bit_high',
  'too_high',
] as const;
export type Sentiment = typeof sentiments[number];

export const sexes = ['f', 'm'] as const;
export type Sex = typeof sexes[number];

export const weightTargets = ['keep_weight', 'lose_weight', 'gain_weight'] as const;
export type WeightTarget = typeof weightTargets[number];

export type WeightTargetCoefficient = {
  id: string;
  name: string;
  coefficient: number;
};

export const weightTargetsData: WeightTargetCoefficient[] = [
  { id: 'keep_weight', name: 'Keep weight', coefficient: 0 },
  { id: 'lose_weight', name: 'Lose weight', coefficient: -500 },
  { id: 'gain_weight', name: 'Gain weight', coefficient: 500 },
];
