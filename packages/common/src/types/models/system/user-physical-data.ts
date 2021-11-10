import { Sex, WeightTarget } from '../../../feedback';

export type UserPhysicalDataAttributes = {
  userId: string;
  sex: Sex | null;
  weightKg: number | null;
  heightCm: number | null;
  physicalActivityLevelId: number | null;
  birthdate: number | null;
  weightTarget: WeightTarget | null;
};
