import type { Prompts } from '@intake24/common/prompts';
import type { MealState, MealTime } from '@intake24/common/types';

export const fromMealTime = (time: MealTime, doubleDigit = true): string => {
  const { hours, minutes } = time;

  if (!doubleDigit) return `${hours}:${minutes}`;

  return [hours, minutes]
    .map((item) => (item.toString().length === 1 ? `0${item}` : item.toString()))
    .join(':');
};

export const toMealTime = (time: string): MealTime => {
  const [hours, minutes] = time.split(':').map((item) => parseInt(item, 10));

  return { hours, minutes };
};

export const toMinutes = (time: MealTime) => time.hours * 60 + time.minutes;

export const minutesWrapAround = (minutes: number) => (minutes < 0 ? 1440 + minutes : minutes);

export const isMealAfter = (time: MealTime, after: MealTime) =>
  time.hours === after.hours ? time.minutes > after.minutes : time.hours > after.hours;

export const minutesAfterMeal = (time: MealTime, after: MealTime) =>
  minutesWrapAround(toMinutes(time) - toMinutes(after));

export const mealWithStartGap = (meal: MealState, startTime: string, gap: number) =>
  meal.time &&
  isMealAfter(meal.time, toMealTime(startTime)) &&
  minutesAfterMeal(meal.time, toMealTime(startTime)) > gap
    ? meal
    : undefined;

export const isMealBefore = (time: MealTime, before: MealTime) =>
  time.hours === before.hours ? time.minutes < before.minutes : time.hours < before.hours;

export const minutesBeforeMeal = (time: MealTime, before: MealTime) =>
  minutesWrapAround(toMinutes(before) - toMinutes(time));

export const mealWithEndGap = (meal: MealState, endTime: string, gap: number) =>
  meal.time &&
  isMealBefore(meal.time, toMealTime(endTime)) &&
  minutesBeforeMeal(meal.time, toMealTime(endTime)) > gap
    ? meal
    : undefined;

export const resolveMealGaps = (meals: MealState[], prompt: Prompts['meal-gap-prompt']) => {
  const mealSize = meals.length;
  if (!mealSize) return [undefined, undefined];

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
      if (!meal.time || !nextMeal.time) return [undefined, undefined];

      if (
        minutesBeforeMeal(meal.time, nextMeal.time) > gap &&
        !meal.flags.includes('no-meals-between')
      )
        return [meal, nextMeal];
    }
  }

  const mealEndGap = mealWithEndGap(lastMeal, endTime, gap);
  if (mealEndGap && !mealEndGap.flags.includes('no-meals-after')) return [undefined, mealEndGap];

  return [undefined, undefined];
};
