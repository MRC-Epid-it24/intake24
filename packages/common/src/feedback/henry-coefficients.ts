import { Range, Sex } from './shared';

export type HenryCoefficient = {
  id: string;
  sex: Sex;
  age: Range;
  weightCoefficient: number;
  heightCoefficient: number;
  constant: number;
};

// Type for validator
export type HenryCoefficients = HenryCoefficient[];
