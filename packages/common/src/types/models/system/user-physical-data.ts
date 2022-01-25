import { Sex, WeightTarget } from '../../../feedback';

export type UserPhysicalDataAttributes = {
  userId: string;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  physicalActivityLevelId: string;
  birthdate: number;
  weightTarget: WeightTarget;
};
