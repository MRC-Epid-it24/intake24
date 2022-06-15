import { NutrientTypeIdEnum } from '@intake24/common/feedback';
import type { SurveySubmissionFoodEntry } from '@intake24/common/types/http';
import { round } from '@intake24/common/util';

export default class SurveyFood {
  readonly code: string;

  readonly englishName: string;

  readonly localName: string;

  readonly nutrientIdConsumptionMap: Map<string, number>;

  constructor(
    code: string,
    englishName: string,
    localName: string,
    nutrients: Map<string, number>
  ) {
    this.code = code;
    this.englishName = englishName;
    this.localName = localName;
    this.nutrientIdConsumptionMap = new Map(nutrients);
  }

  static fromJson(food: SurveySubmissionFoodEntry): SurveyFood {
    const mp = new Map<string, number>();
    for (const nutrient of food.nutrients) {
      mp.set(nutrient.nutrientTypeId, nutrient.amount);
    }

    return new SurveyFood(food.code, food.englishName, food.localName ?? '', mp);
  }

  clone(): SurveyFood {
    return new SurveyFood(
      this.code,
      this.englishName,
      this.localName,
      this.nutrientIdConsumptionMap
    );
  }

  getConsumption(nutrientTypeId: string): number {
    return round(this.nutrientIdConsumptionMap.get(nutrientTypeId) || 0);
  }

  getEnergy(): number {
    return this.getConsumption(NutrientTypeIdEnum.Energy);
  }
}
