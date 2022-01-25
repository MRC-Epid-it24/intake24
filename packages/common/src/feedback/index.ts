export const feedbackStyles = ['default', 'playful'] as const;
export type FeedbackStyle = typeof feedbackStyles[number];

export enum NutrientRuleType {
  PERCENTAGE_OF_ENERGY = 'percentage_of_energy',
  ENERGY_DIVIDED_BY_BMR = 'energy_divided_by_bmr',
  PER_UNIT_OF_WEIGHT = 'per_unit_of_weight',
  RANGE = 'range',
}

export enum Sentiment {
  TOO_LOW = 'too_low',
  LOW = 'low',
  BIT_LOW = 'bit_low',
  GOOD = 'good',
  EXCELLENT = 'excellent',
  HIGH = 'high',
  BIT_HIGH = 'bit_high',
  TOO_HIGH = 'too_high',
}

export const sexes = ['f', 'm'] as const;
export type Sex = typeof sexes[number];

export const weightTargets = ['keep_weight', 'lose_weight', 'gain_weight'] as const;
export type WeightTarget = typeof weightTargets[number];

export type WeightTargetCoefficient = {
  id: string;
  name: string;
  coefficient: number;
};

export type HenryCoefficient = {
  sex: Sex;
  ageRange: [number, number];
  weightCoefficient: number;
  heightCoefficient: number;
  constant: number;
};

// TODO: move to database?
export const henryCoefficientsData: HenryCoefficient[] = [
  {
    sex: 'm',
    ageRange: [0, 3],
    weightCoefficient: 28.2,
    heightCoefficient: 859,
    constant: -371,
  },
  {
    sex: 'm',
    ageRange: [3, 10],
    weightCoefficient: 15.1,
    heightCoefficient: 313,
    constant: 306,
  },
  {
    sex: 'm',
    ageRange: [10, 18],
    weightCoefficient: 15.6,
    heightCoefficient: 266,
    constant: 299,
  },
  {
    sex: 'm',
    ageRange: [18, 30],
    weightCoefficient: 14.4,
    heightCoefficient: 313,
    constant: 113,
  },
  {
    sex: 'm',
    ageRange: [30, 60],
    weightCoefficient: 11.4,
    heightCoefficient: 541,
    constant: -137,
  },
  {
    sex: 'm',
    ageRange: [60, Number.MAX_VALUE],
    weightCoefficient: 11.4,
    heightCoefficient: 541,
    constant: -256,
  },
  {
    sex: 'f',
    ageRange: [0, 3],
    weightCoefficient: 30.4,
    heightCoefficient: 703,
    constant: -287,
  },
  {
    sex: 'f',
    ageRange: [3, 10],
    weightCoefficient: 15.9,
    heightCoefficient: 210,
    constant: 349,
  },
  {
    sex: 'f',
    ageRange: [10, 18],
    weightCoefficient: 9.4,
    heightCoefficient: 249,
    constant: 462,
  },
  {
    sex: 'f',
    ageRange: [18, 30],
    weightCoefficient: 10.4,
    heightCoefficient: 615,
    constant: -282,
  },
  {
    sex: 'f',
    ageRange: [30, 60],
    weightCoefficient: 8.18,
    heightCoefficient: 502,
    constant: -11.6,
  },
  {
    sex: 'f',
    ageRange: [60, Number.MAX_VALUE],
    weightCoefficient: 8.52,
    heightCoefficient: 421,
    constant: 10.7,
  },
];

export const weightTargetsData: WeightTargetCoefficient[] = [
  { id: 'keep_weight', name: 'Keep weight', coefficient: 0 },
  { id: 'lose_weight', name: 'Lose weight', coefficient: -500 },
  { id: 'gain_weight', name: 'Gain weight', coefficient: 500 },
];
