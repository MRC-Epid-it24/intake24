export const sexes = ['f', 'm'] as const;
export type Sex = typeof sexes[number];

export const weightTargets = ['keep_weight', 'lose_weight', 'gain_weight'] as const;
export type WeightTarget = typeof weightTargets[number];

export type UserPhysicalDataAttributes = {
  userId: string;
  sex: Sex | null;
  weightKg: number | null;
  heightCm: number | null;
  physicalActivityLevelId: number | null;
  birthdate: number | null;
  weightTarget: WeightTarget | null;
};
