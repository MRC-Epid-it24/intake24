import type { SurveySubmissionMealEntry } from '@intake24/common/types/http';
import { fromMealTime } from '@intake24/common/surveys';

import SurveyFood from './survey-food';

export default class SurveyMeal {
  readonly name;

  readonly hours;

  readonly minutes;

  readonly time;

  readonly duration;

  readonly customFields;

  readonly foods;

  constructor(
    name: string | null,
    hours: number,
    minutes: number,
    duration: number | null,
    customFields: { name: string; value: string }[],
    foods: SurveyFood[]
  ) {
    const time = fromMealTime({ hours, minutes });

    this.name = name ?? `Meal ${time}`;
    this.hours = hours;
    this.minutes = minutes;
    this.time = time;
    this.duration = duration;
    this.customFields = customFields;
    this.foods = foods.map((f) => f.clone());
  }

  clone(): SurveyMeal {
    return new SurveyMeal(
      this.name,
      this.hours,
      this.minutes,
      this.duration,
      this.customFields,
      this.foods
    );
  }

  static fromJson(meal: SurveySubmissionMealEntry): SurveyMeal {
    return new SurveyMeal(
      meal.name,
      meal.hours,
      meal.minutes,
      meal.duration,
      meal.customFields.map(({ name, value }) => ({ name, value })),
      meal.foods.map((food) => SurveyFood.fromJson(food))
    );
  }
}
