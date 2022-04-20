import { HenryCoefficient, WeightTargetCoefficient } from '@intake24/common/feedback';
import { UserPhysicalDataResponse } from '@intake24/common/types/http';
import { PhysicalActivityLevelAttributes } from '@intake24/common/types/models';
import { round } from '@intake24/common/util';
import HenryCoefficientsCalculator from './henry-coefficient-calculator';

export default class UserDemographic {
  bmrCalculator: HenryCoefficientsCalculator;

  constructor(
    readonly physicalData: NonNullable<UserPhysicalDataResponse>,
    private readonly physicalActivityLevel: PhysicalActivityLevelAttributes,
    private readonly weightTarget: WeightTargetCoefficient,
    private readonly henryCoefficients: HenryCoefficient[]
  ) {
    this.bmrCalculator = HenryCoefficientsCalculator.fromJson(henryCoefficients);
  }

  getAge(): number {
    return new Date().getFullYear() - this.physicalData.birthdate;
  }

  getBmr(): number {
    return round(this.bmrCalculator.getBMR(this));
  }

  getEnergyRequirement(): number {
    return round(
      this.getBmr() * this.physicalActivityLevel.coefficient + this.weightTarget.coefficient
    );
  }
}
