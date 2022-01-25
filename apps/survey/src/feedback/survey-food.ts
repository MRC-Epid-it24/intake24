import { SurveySubmissionFoodEntry } from '@intake24/common/types/http';
import { NutrientTypeIdEnum } from './character';

export default class SurveyFood {
  readonly code: string;

  readonly englishName: string;

  readonly localName: string;

  readonly nutrientIdConsumptionMap: Map<string, number>;

  readonly foodGroupProportions: Map<number, number>;

  readonly foodGroupWeights: Map<number, number>;

  constructor(
    code: string,
    englishName: string,
    localName: string,
    nutrients: Map<string, number>,
    foodGroupProportions: Map<number, number>,
    foodGroupWeights: Map<number, number>
  ) {
    this.code = code;
    this.englishName = englishName;
    this.localName = localName;
    this.nutrientIdConsumptionMap = new Map(nutrients);
    this.foodGroupProportions = new Map(foodGroupProportions);
    this.foodGroupWeights = new Map(foodGroupWeights);
  }

  static fromJson(food: SurveySubmissionFoodEntry): SurveyFood {
    const mp = new Map<string, number>();
    for (const nutrient of food.nutrients) {
      mp.set(nutrient.nutrientTypeId, nutrient.amount);
    }

    // const foodWeight = parseFloat(food.portionSizes.portionWeight);
    // TODO: computed value server-side?
    const foodWeight = parseFloat(
      food.portionSizes.find((item) => item.name === 'portionWeight')?.value ?? '0'
    );

    const foodGroupProportions = new Map<number, number>();
    const foodGroupWeights = new Map<number, number>();

    // TODO: add server-side?
    /* for (const i of food.compoundFoodGroups) {
      const foodGroupId = parseInt(i, 10);
      const proportion = food.compoundFoodGroups[i];
      foodGroupProportions.set(foodGroupId, proportion);
      foodGroupWeights.set(foodGroupId, (proportion / 100) * foodWeight);
    } */

    return new SurveyFood(
      food.code,
      food.englishName,
      food.localName ?? '',
      mp,
      foodGroupProportions,
      foodGroupWeights
    );
  }

  clone(): SurveyFood {
    return new SurveyFood(
      this.code,
      this.englishName,
      this.localName,
      this.nutrientIdConsumptionMap,
      this.foodGroupProportions,
      this.foodGroupWeights
    );
  }

  getConsumption(nutrientTypeId: string): number {
    return Math.round((this.nutrientIdConsumptionMap.get(nutrientTypeId) || 0) * 10) / 10;
  }

  getEnergy(): number {
    return this.getConsumption(NutrientTypeIdEnum.Energy);
  }
}
