import { WeightTargetCoefficient } from '@intake24/common/feedback';
import { UserPhysicalDataResponse } from '@intake24/common/types/http';
import { PhysicalActivityLevelAttributes } from '@intake24/common/types/models';
import HenryCoefficientsCalculator from './henry-coefficient-calculator';

export default class UserDemographic {
  constructor(
    readonly physicalData: NonNullable<UserPhysicalDataResponse>,
    private readonly physicalActivityLevel: PhysicalActivityLevelAttributes,
    private readonly weightTarget: WeightTargetCoefficient,
    private readonly bmrCalculator: HenryCoefficientsCalculator
  ) {
    this.physicalData = physicalData;
    this.bmrCalculator = bmrCalculator;
  }

  clone(): UserDemographic {
    return new UserDemographic(
      this.physicalData,
      this.physicalActivityLevel,
      this.weightTarget,
      this.bmrCalculator
    );
  }

  getAge(): number {
    return new Date().getFullYear() - this.physicalData.birthdate;
  }

  getBmr(): number {
    return Math.round(this.bmrCalculator.getBMR(this) * 10) / 10;
  }

  getEnergyRequirement(): number {
    return (
      Math.round(
        (this.getBmr() * this.physicalActivityLevel.coefficient + this.weightTarget.coefficient) *
          10
      ) / 10
    );
  }
}
