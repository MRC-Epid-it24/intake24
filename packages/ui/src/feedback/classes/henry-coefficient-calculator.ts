import { HenryCoefficient as HenryCoefficientRecord } from '@intake24/common/feedback';
import HenryCoefficient from './henry-coefficient';
import type UserDemographic from './user-demographic';

export default class HenryCoefficientsCalculator {
  private readonly coefficients: HenryCoefficient[];

  constructor(henryCoefficients: HenryCoefficient[]) {
    this.coefficients = henryCoefficients.map((hc) => hc.clone());
  }

  static fromJson(coefficients: HenryCoefficientRecord[]): HenryCoefficientsCalculator {
    return new HenryCoefficientsCalculator(
      coefficients.map((coefficient) => HenryCoefficient.fromJson(coefficient))
    );
  }

  getBMR(userDemographic: UserDemographic): number {
    const coefficients = this.coefficients.filter((c) => c.matchesUserDemographic(userDemographic));

    if (!coefficients.length) {
      throw new Error('Henry coefficients matching user demographic were not found');
    } else {
      return HenryCoefficientsCalculator.calculateBMR(userDemographic, coefficients[0]);
    }
  }

  private static calculateBMR(userDemographic: UserDemographic, hCoef: HenryCoefficient): number {
    return (
      hCoef.weightCoefficient * userDemographic.physicalData.weightKg +
      hCoef.heightCoefficient * (userDemographic.physicalData.heightCm / 100) +
      hCoef.constant
    );
  }
}
