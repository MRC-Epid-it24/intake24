/* eslint-disable import/prefer-default-export */
import { HenryCoefficient } from '@intake24/common/feedback';

export const henryCoefficientDefaults: HenryCoefficient = {
  sex: 'm',
  age: { start: 0, end: 60 },
  constant: 0,
  heightCoefficient: 0,
  weightCoefficient: 0,
};
