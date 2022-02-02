import { NutrientRuleType, Sentiment, Sex } from '@intake24/common/feedback';
import {
  DemographicGroup as DemographicGroupResponse,
  NutrientType,
} from '@intake24/common/types/http';
import DemographicScaleSector from './demographic-scale-sector';
import AggregateFoodStats from './aggregate-food-stats';
import DemographicRange from './demographic-range';
import DemographicResult from './demographic-result';
import UserDemographic from './user-demographic';

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
    nutrientTypeKCalPerUnit: number | null,
    nutrient: NutrientType
  ) {
    this.id = id;
    this.sex = sex;
    this.age = age ? age.clone() : null;
    this.height = height ? height.clone() : null;
    this.weight = weight ? weight.clone() : null;
    this.nutrient = nutrient;
    this.nutrientRuleType = nutrientRuleType;
    this.nutrientTypeKCalPerUnit = nutrientTypeKCalPerUnit;
    this.scaleSectors = scaleSectors.map((s) => s.clone());
  }

  static fromJson(group: DemographicGroupResponse, nutrient: NutrientType): DemographicGroup {
    return new DemographicGroup(
      group.id,
      group.nutrientRuleType,
      group.scaleSectors.map(DemographicScaleSector.fromJson),
      group.sex,
      DemographicRange.fromJson(group.minAge, group.maxAge),
      DemographicRange.fromJson(group.minHeight, group.maxHeight),
      DemographicRange.fromJson(group.minWeight, group.maxWeight),
      group.nutrientTypeInKcal?.kcalPerUnit ?? null,
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
      this.nutrientTypeKCalPerUnit,
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
    const result = [
      this.sex ? this.sex === userDemographic.physicalData.sex : true,
      this.age ? this.age.contains(userDemographic.getAge()) : true,
      this.height ? this.height.contains(userDemographic.physicalData.heightCm) : true,
      this.weight ? this.weight.contains(userDemographic.physicalData.weightKg) : true,
    ].reduce((a, b) => a && b);

    return result;
  }

  private getConsumption(userDemographic: UserDemographic, foods: AggregateFoodStats[]): number {
    const consumption = foods
      .map((f) => f.getAverageIntake(this.nutrient.id))
      .reduce((a, b) => a + b, 0);

    if (this.nutrientRuleType === NutrientRuleType.ENERGY_DIVIDED_BY_BMR)
      return (consumption * 100) / userDemographic.getEnergyRequirement();

    if (this.nutrientRuleType === NutrientRuleType.PER_UNIT_OF_WEIGHT)
      return consumption / userDemographic.physicalData.weightKg;

    if (this.nutrientRuleType === NutrientRuleType.PERCENTAGE_OF_ENERGY) {
      const energy = foods.map((f) => f.getAverageEnergyIntake()).reduce((a, b) => a + b, 0);
      if (energy === 0) return 0;

      return (this.nutrientTypeKCalPerUnit ?? 0 * 100) / energy;
    }

    if (this.nutrientRuleType === NutrientRuleType.RANGE) return consumption;

    throw new Error(`Unknown nutrient rule type: ${this.nutrientRuleType}`);
  }

  private getScaleSectorByValue(value: number): DemographicScaleSector | undefined {
    const scaleSectors = this.scaleSectors.filter((ss) => ss.range.contains(value));
    return scaleSectors.length ? scaleSectors[0] : undefined;
  }

  private getScaleSectorByBestSentiment(): DemographicScaleSector | undefined {
    const excScaleSectors = this.scaleSectors.filter((ss) => ss.sentiment === Sentiment.EXCELLENT);
    if (excScaleSectors.length) return excScaleSectors[0];

    const goodScaleSectors = this.scaleSectors.filter((ss) => ss.sentiment === Sentiment.GOOD);
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
      this.nutrientTypeKCalPerUnit,
      this.nutrient
    );
  }
}
