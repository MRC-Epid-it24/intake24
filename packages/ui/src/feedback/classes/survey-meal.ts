import type { SurveySubmissionMealEntry } from '@intake24/common/types/http';

import SurveyFood from './survey-food';

export default class SurveyMeal {
  readonly name: string | null;

  readonly hours: number;

  readonly minutes: number;

  readonly foods: SurveyFood[];

  constructor(name: string | null, hours: number, minutes: number, foods: SurveyFood[]) {
    this.name = name;
    this.hours = hours;
    this.minutes = minutes;
    this.foods = foods.map((f) => f.clone());
  }

  clone(): SurveyMeal {
    return new SurveyMeal(this.name, this.hours, this.minutes, this.foods);
  }

  static fromJson(meal: SurveySubmissionMealEntry): SurveyMeal {
    return new SurveyMeal(
      meal.name,
      meal.hours,
      meal.minutes,
      meal.foods.map((food) => SurveyFood.fromJson(food))
    );
  }
}
