import { fromMealTime } from '@intake24/common/surveys';
import type { SurveySubmissionMealEntry } from '@intake24/common/types/http';

import SurveyFood from './survey-food';

export default class SurveyMeal {
  readonly name;

  readonly hours;

  readonly minutes;

  readonly time;

  readonly duration;

  readonly customFields;

  readonly foods;

  readonly missingFoods;

  constructor(
    name: string | null,
    hours: number,
    minutes: number,
    duration: number | null,
    customFields: { name: string; value: string }[],
    foods: SurveyFood[],
    missingFoods: SurveySubmissionMealEntry['missingFoods'],
  ) {
    const time = fromMealTime({ hours, minutes });

    this.name = name ?? `Meal ${time}`;
    this.hours = hours;
    this.minutes = minutes;
    this.time = time;
    this.duration = duration;
    this.customFields = customFields;
    this.foods = foods.map(food => food.clone());
    this.missingFoods = missingFoods.map(food => ({ ...food }));
  }

  clone(): SurveyMeal {
    return new SurveyMeal(
      this.name,
      this.hours,
      this.minutes,
      this.duration,
      this.customFields,
      this.foods,
      this.missingFoods,
    );
  }

  static fromJson(meal: SurveySubmissionMealEntry): SurveyMeal {
    return new SurveyMeal(
      meal.name,
      meal.hours,
      meal.minutes,
      meal.duration,
      meal.customFields.map(({ name, value }) => ({ name, value })),
      meal.foods.map(food => SurveyFood.fromJson(food)),
      meal.missingFoods.map(food => ({ ...food })),
    );
  }
}
