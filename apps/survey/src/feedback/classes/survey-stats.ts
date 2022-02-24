import { SurveySubmissionEntry } from '@intake24/common/types/http';
import AggregateFoodStats from './aggregate-food-stats';
import SurveyFood from './survey-food';
import SurveySubmission from './survey-submission';

export type FruitAndVegPortions = {
  readonly juices: number;
  readonly beansAndPulses: number;
  readonly fruit: number;
  readonly driedFruit: number;
  readonly vegetables: number;
  readonly total: number;
};

export default class SurveyStats {
  readonly submissions: SurveySubmission[];

  constructor(submissions: SurveySubmission[]) {
    this.submissions = submissions.map((ss) => ss.clone());
  }

  clone(): SurveyStats {
    return new SurveyStats(this.submissions);
  }

  static fromJson(jsonList: SurveySubmissionEntry[]): SurveyStats {
    return new SurveyStats(jsonList.map((js) => SurveySubmission.fromJson(js)));
  }

  // Returns a flat array of all food records for the selected day or for all days
  // if no day is selected
  private getFoods(selected: string[]): SurveyFood[] {
    return this.submissions
      .filter((submission) => selected.includes(submission.id))
      .map((submission) => submission.getFoods())
      .reduce((acc, foods) => acc.concat(foods), []);
  }

  private readonly JUICE_NUTRIENT_IDS = ['254', '255'];

  private readonly FRUIT_NUTRIENT_IDS = ['252'];

  private readonly DRIED_FRUIT_NUTRIENT_IDS = ['253'];

  private readonly VEGETABLE_NUTRIENT_IDS = ['262', '256', '257', '258', '259'];

  private readonly BEANS_PULSES_NUTRIENT_IDS = ['260'];

  private static getTotalForSubset(nutrientIntake: Map<string, number>, nutrientIds: string[]) {
    let total = 0;

    nutrientIntake.forEach((weight, groupId) => {
      if (nutrientIds.indexOf(groupId) !== -1) {
        total += weight;
      }
    });

    return total;
  }

  getFruitAndVegPortions(selected: string[]): FruitAndVegPortions {
    const averages = this.getAverageIntake(selected);

    const juicesTotal = SurveyStats.getTotalForSubset(averages, this.JUICE_NUTRIENT_IDS);
    const beansAndPulsesTotal = SurveyStats.getTotalForSubset(
      averages,
      this.BEANS_PULSES_NUTRIENT_IDS
    );
    const fruitTotal = SurveyStats.getTotalForSubset(averages, this.FRUIT_NUTRIENT_IDS);
    const driedFruitTotal = SurveyStats.getTotalForSubset(averages, this.DRIED_FRUIT_NUTRIENT_IDS);
    const vegetablesTotal = SurveyStats.getTotalForSubset(averages, this.VEGETABLE_NUTRIENT_IDS);

    const juices = Math.min(150, juicesTotal) / 150;
    const beansAndPulses = Math.min(80, beansAndPulsesTotal) / 80;
    const fruit = fruitTotal / 80;
    const driedFruit = driedFruitTotal / 30;
    const vegetables = vegetablesTotal / 80;

    return {
      juices,
      beansAndPulses,
      fruit,
      driedFruit,
      vegetables,
      total: juices + beansAndPulses + fruit + driedFruit + vegetables,
    };
  }

  getAverageIntake(selected: string[]): Map<string, number> {
    const foods = this.getFoods(selected);
    const averageIntake = new Map<string, number>();

    foods.forEach((food) =>
      Array.from(food.nutrientIdConsumptionMap.keys()).forEach((nutrientId) => {
        if (!averageIntake.has(nutrientId)) {
          averageIntake.set(nutrientId, food.nutrientIdConsumptionMap.get(nutrientId) as number);
        } else {
          averageIntake.set(
            nutrientId,
            (averageIntake.get(nutrientId) as number) +
              (food.nutrientIdConsumptionMap.get(nutrientId) as number)
          );
        }
      })
    );

    Array.from(averageIntake.keys()).forEach((nutrientId) => {
      averageIntake.set(nutrientId, (averageIntake.get(nutrientId) as number) / selected.length);
    });

    return averageIntake;
  }

  getReducedFoods(selected: string[]): AggregateFoodStats[] {
    const foods = this.getFoods(selected);

    const uniqueFoodCodes = Array.from(new Set(foods.map((f) => f.code)));

    return uniqueFoodCodes.map((code) => {
      const totalConsumptionMap: Map<string, number> = new Map();
      const matchingFoods = foods.filter((f) => f.code === code);
      matchingFoods.forEach((f) => {
        Array.from(f.nutrientIdConsumptionMap.keys()).forEach((k) => {
          if (!totalConsumptionMap.has(k)) totalConsumptionMap.set(k, 0);

          totalConsumptionMap.set(
            k,
            (totalConsumptionMap.get(k) as number) + (f.nutrientIdConsumptionMap.get(k) as number)
          );
        });
      });
      // We need to get average consumption per day.
      // At the moment we do that by getting average consumption of nutrient per one submission
      Array.from(totalConsumptionMap.keys()).forEach((k) => {
        totalConsumptionMap.set(k, (totalConsumptionMap.get(k) as number) / selected.length);
      });
      const firstFood = matchingFoods[0];
      return new AggregateFoodStats(firstFood.localName, totalConsumptionMap);
    });
  }
}
