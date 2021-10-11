import { PhysicalActivityLevelAttributes, Sex } from '../models';

export type HenryCoefficient = {
  sex: Sex;
  ageRange: [number, number];
  weightCoefficient: number;
  heightCoefficient: number;
  constant: number;
};

export type HenryCoefficientsResponse = HenryCoefficient[];

export type PhysicalActivityLevelsResponse = PhysicalActivityLevelAttributes[];

export type WeightTarget = {
  id: string;
  name: string;
  coefficient: number;
};

export type WeightTargetsResponse = WeightTarget[];
