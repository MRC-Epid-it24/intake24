import { HenryCoefficient as HenryCoefficientRecord, Sex } from '@intake24/common/feedback';
import DemographicRange from './demographic-range';
import UserDemographic from './user-demographic';

export default class HenryCoefficient {
  readonly sex: Sex;

  readonly ageRange: DemographicRange;

  readonly weightCoefficient: number;

  readonly heightCoefficient: number;

  readonly constant: number;

  constructor(
    sex: Sex,
    ageRange: DemographicRange,
    weightCoefficient: number,
    heightCoefficient: number,
    constant: number
  ) {
    this.sex = sex;
    this.ageRange = ageRange.clone();
    this.weightCoefficient = weightCoefficient;
    this.heightCoefficient = heightCoefficient;
    this.constant = constant;
  }

  static fromJson(coefficient: HenryCoefficientRecord): HenryCoefficient {
    return new HenryCoefficient(
      coefficient.sex,
      new DemographicRange(coefficient.age.start, coefficient.age.end),
      coefficient.weightCoefficient,
      coefficient.heightCoefficient,
      coefficient.constant
    );
  }

  clone(): HenryCoefficient {
    return new HenryCoefficient(
      this.sex,
      this.ageRange,
      this.weightCoefficient,
      this.heightCoefficient,
      this.constant
    );
  }

  matchesUserDemographic(ud: UserDemographic): boolean {
    return this.sex === ud.physicalData.sex && this.ageRange.contains(ud.getAge());
  }
}
