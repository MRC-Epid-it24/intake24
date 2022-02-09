import { Range, Sex } from './shared';

export type HenryCoefficient = {
  sex: Sex;
  age: Range;
  weightCoefficient: number;
  heightCoefficient: number;
  constant: number;
};
