import type {
  DemographicGroup as FeedbackSchemeDemographicGroup,
  NutrientRuleType,
  Sex,
} from '@intake24/common/feedback';
import type { NutrientType } from '@intake24/common/types/http';

import type AggregateFoodStats from './aggregate-food-stats';
import type UserDemographic from './user-demographic';
import DemographicRange from './demographic-range';
import DemographicResult from './demographic-result';
import DemographicScaleSector from './demographic-scale-sector';

export default class DemographicGroup {
  readonly id: string;

  readonly sex: Sex | null;

  readonly age: DemographicRange | null;

  readonly height: DemographicRange | null;

  readonly weight: DemographicRange | null;

  readonly nutrient: NutrientType;

  readonly nutrientRuleType: NutrientRuleType;

  readonly nutrientTypeKCalPerUnit: number | null;

  readonly scaleSectors: DemographicScaleSector[];

  constructor(
    id: string,
    nutrientRuleType: NutrientRuleType,
    scaleSectors: DemographicScaleSector[],
    sex: Sex | null,
    age: DemographicRange | null,
    height: DemographicRange | null,
    weight: DemographicRange | null,
    nutrient: NutrientType
  ) {
    this.id = id;
    this.nutrientRuleType = nutrientRuleType;
    this.scaleSectors = scaleSectors.map((s) => s.clone());
    this.sex = sex;
    this.age = age ? age.clone() : null;
    this.height = height ? height.clone() : null;
    this.weight = weight ? weight.clone() : null;
    this.nutrient = nutrient;

    this.nutrientTypeKCalPerUnit = nutrient.kcalPerUnit;
  }

  static fromJson(group: FeedbackSchemeDemographicGroup, nutrient: NutrientType): DemographicGroup {
    const { age, height, weight } = group;

    return new DemographicGroup(
      group.id,
      group.nutrientRuleType,
      group.scaleSectors.map(DemographicScaleSector.fromJson),
      group.sex,
      age ? DemographicRange.fromJson(age.start, age.end) : null,
      height ? DemographicRange.fromJson(height.start, height.end) : null,
      weight ? DemographicRange.fromJson(weight.start, weight.end) : null,
      nutrient
    );
  }

  clone(): DemographicGroup {
    return new DemographicGroup(
      this.id,
      this.nutrientRuleType,
      this.scaleSectors,
      this.sex,
      this.age,
      this.height,
      this.weight,
      this.nutrient
    );
  }

  getResult(userDemographic: UserDemographic, foods: AggregateFoodStats[]): DemographicResult {
    const cons = this.getConsumption(userDemographic, foods);
    const scaleSector = this.getScaleSectorByValue(cons);
    const bestScaleSector = this.getScaleSectorByBestSentiment();

    if (!scaleSector || !bestScaleSector) {
      console.warn(
        'Scale sector for user demographic',
        userDemographic,
        'and consumption',
        cons,
        'was not found in demographic group',
        this
      );

      return new DemographicResult(
        this.cloneWithCustomScaleSectors([]),
        this.cloneWithCustomScaleSectors([]),
        cons
      );
    }

    return new DemographicResult(
      this.cloneWithCustomScaleSectors([scaleSector]),
      this.cloneWithCustomScaleSectors([bestScaleSector]),
      cons
    );
  }

  matchesUserDemographic(userDemographic: UserDemographic): boolean {
    const { sex, heightCm, weightKg } = userDemographic.physicalData;
    const age = userDemographic.getAge();

    const result = [
      !!(this.sex === null || (this.sex !== null && this.sex === sex)),
      !!(this.age === null || (this.age !== null && this.age.contains(age))),
      !!(this.height === null || (this.height !== null && this.height.contains(heightCm))),
      !!(this.weight === null || (this.weight !== null && this.weight.contains(weightKg))),
    ].reduce((a, b) => a && b);

    return result;
  }

  private getConsumption(userDemographic: UserDemographic, foods: AggregateFoodStats[]): number {
    const consumption = foods
      .map((f) => f.getAverageIntake(this.nutrient.id))
      .reduce((a, b) => a + b, 0);

    if (this.nutrientRuleType === 'energy_divided_by_bmr')
      return (consumption * 100) / userDemographic.getEnergyRequirement();

    if (this.nutrientRuleType === 'per_unit_of_weight') {
      const { weightKg } = userDemographic.physicalData;

      if (weightKg === null)
        throw new Error(`Cannot calculate 'per_unit_of_weight' nutrient rule type without weight.`);

      return consumption / weightKg;
    }

    if (this.nutrientRuleType === 'percentage_of_energy') {
      const energy = foods.map((f) => f.getAverageEnergyIntake()).reduce((a, b) => a + b, 0);
      if (energy === 0) return 0;

      return (this.nutrientTypeKCalPerUnit ?? 0 * 100) / energy;
    }

    if (this.nutrientRuleType === 'range') return consumption;

    throw new Error(`Unknown nutrient rule type: ${this.nutrientRuleType}`);
  }

  private getScaleSectorByValue(value: number): DemographicScaleSector | undefined {
    const scaleSectors = this.scaleSectors.filter((ss) => ss.range.contains(value));
    return scaleSectors.length ? scaleSectors[0] : undefined;
  }

  private getScaleSectorByBestSentiment(): DemographicScaleSector | undefined {
    const excScaleSectors = this.scaleSectors.filter((ss) => ss.sentiment === 'excellent');
    if (excScaleSectors.length) return excScaleSectors[0];

    const goodScaleSectors = this.scaleSectors.filter((ss) => ss.sentiment === 'good');
    if (goodScaleSectors.length) return goodScaleSectors[0];

    return undefined;
  }

  private cloneWithCustomScaleSectors(scaleSectors: DemographicScaleSector[]): DemographicGroup {
    return new DemographicGroup(
      this.id,
      this.nutrientRuleType,
      scaleSectors,
      this.sex,
      this.age,
      this.height,
      this.weight,
      this.nutrient
    );
  }
}
