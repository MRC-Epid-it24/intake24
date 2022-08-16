import type { HenryCoefficient, WeightTargetCoefficient } from '@intake24/common/feedback';
import type { UserPhysicalDataResponse } from '@intake24/common/types/http';
import type { PhysicalActivityLevelAttributes } from '@intake24/common/types/models';
import { round } from '@intake24/common/util';

import HenryCoefficientsCalculator from './henry-coefficient-calculator';

export default class UserDemographic {
  readonly physicalData: NonNullable<UserPhysicalDataResponse>;

  private readonly henryCoefficients: HenryCoefficient[];

  readonly physicalActivityLevel?: PhysicalActivityLevelAttributes;

  private readonly weightTarget?: WeightTargetCoefficient;

  private readonly bmrCalculator: HenryCoefficientsCalculator;

  constructor(
    physicalData: NonNullable<UserPhysicalDataResponse>,
    henryCoefficients: HenryCoefficient[],
    physicalActivityLevel?: PhysicalActivityLevelAttributes,
    weightTarget?: WeightTargetCoefficient
  ) {
    this.physicalData = physicalData;
    this.henryCoefficients = henryCoefficients;
    this.physicalActivityLevel = physicalActivityLevel;
    this.weightTarget = weightTarget;

    this.bmrCalculator = HenryCoefficientsCalculator.fromJson(henryCoefficients);
  }

  getAge(): number {
    const { birthdate } = this.physicalData;
    if (birthdate === null) throw new Error('Cannot calculate age without birthdate.');

    return new Date().getFullYear() - birthdate;
  }

  getBmr(): number {
    return round(this.bmrCalculator.getBMR(this));
  }

  getEnergyRequirement(): number {
    const { physicalActivityLevel, weightTarget } = this;

    if (!physicalActivityLevel)
      throw new Error('Cannot calculate energy requirement without physicalActivityLevel.');
    if (!weightTarget)
      throw new Error('Cannot calculate energy requirement without physicalActivityLevel.');

    return round(this.getBmr() * physicalActivityLevel.coefficient + weightTarget.coefficient);
  }
}
