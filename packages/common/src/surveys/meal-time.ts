import type { Prompts } from '@intake24/common/prompts';
import type { MealState, MealTime } from '@intake24/common/types';

export function fromMealTime(time: MealTime, doubleDigit = true): string {
  const { hours, minutes } = time;

  if (!doubleDigit)
    return `${hours}:${minutes}`;

  return [hours, minutes]
    .map(item => (item.toString().length === 1 ? `0${item}` : item.toString()))
    .join(':');
}

export function toMealTime(time: string): MealTime {
  const [hours, minutes] = time.split(':').map(item => Number.parseInt(item, 10));

  return { hours, minutes };
}

export const toMinutes = (time: MealTime) => time.hours * 60 + time.minutes;

export function sortMeals(a: MealState, b: MealState) {
  if (!a.time || !b.time)
    return 0;

  return toMinutes(a.time) - toMinutes(b.time);
}

export const minutesWrapAround = (minutes: number) => (minutes < 0 ? 1440 + minutes : minutes);

export function isMealAfter(time: MealTime, after: MealTime) {
  return time.hours === after.hours ? time.minutes > after.minutes : time.hours > after.hours;
}

export function minutesAfterMeal(time: MealTime, after: MealTime) {
  return minutesWrapAround(toMinutes(time) - toMinutes(after));
}

export function mealWithStartGap(meal: MealState, startTime: string, gap: number) {
  return meal.time
    && isMealAfter(meal.time, toMealTime(startTime))
    && minutesAfterMeal(meal.time, toMealTime(startTime)) > gap
    ? meal
    : undefined;
}

export function isMealBefore(time: MealTime, before: MealTime) {
  return time.hours === before.hours ? time.minutes < before.minutes : time.hours < before.hours;
}

export function minutesBeforeMeal(time: MealTime, before: MealTime) {
  return minutesWrapAround(toMinutes(before) - toMinutes(time));
}

export function mealWithEndGap(meal: MealState, endTime: string, gap: number) {
  return meal.time
    && isMealBefore(meal.time, toMealTime(endTime))
    && minutesBeforeMeal(meal.time, toMealTime(endTime)) > gap
    ? meal
    : undefined;
}

export function resolveMealGaps(meals: MealState[], prompt: Prompts['meal-gap-prompt']) {
  const mealSize = meals.length;
  if (!mealSize)
    return [undefined, undefined];

  const firstMeal = meals[0];
  const lastMeal = meals[mealSize - 1];
  const { gap, startTime, endTime } = prompt;

  const mealStartGap = mealWithStartGap(firstMeal, startTime, gap);
  if (mealStartGap && !mealStartGap.flags.includes('no-meals-before'))
    return [mealStartGap, undefined];

  if (mealSize > 1) {
    for (let i = 0; i < mealSize - 1; i++) {
      const meal = meals[i];
      const nextMeal = meals[i + 1];
      if (!meal.time || !nextMeal.time)
        return [undefined, undefined];

      if (
        minutesBeforeMeal(meal.time, nextMeal.time) > gap
        && !meal.flags.includes('no-meals-between')
      )
        return [meal, nextMeal];
    }
  }

  const mealEndGap = mealWithEndGap(lastMeal, endTime, gap);
  if (mealEndGap && !mealEndGap.flags.includes('no-meals-after'))
    return [undefined, mealEndGap];

  return [undefined, undefined];
}
