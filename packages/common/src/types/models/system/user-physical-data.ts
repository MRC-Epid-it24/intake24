export enum Sex {
  FEMALE = 'f',
  MALE = 'm',
}

export enum WeightTarget {
  KEEP_WEIGHT = 'keep_weight',
  LOSE_WEIGHT = 'lose_weight',
  GAIN_WEIGHT = 'gain_weight',
}

export type UserPhysicalDataAttributes = {
  userId: string;
  sex: Sex | null;
  weightKg: number | null;
  heightCm: number | null;
  physicalActivityLevelId: number | null;
  birthdate: Date | null;
  weightTarget: WeightTarget | null;
};
