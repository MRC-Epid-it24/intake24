import type { FoodState, MissingFood, PortionSizeMethodId } from '@intake24/common/types';

export function portionSizeMethodSelected(food: FoodState, method: PortionSizeMethodId): boolean {
  if (food.type !== 'encoded-food') return false;

  if (food.portionSizeMethodIndex === null) return false;

  if (food.data.portionSizeMethods[food.portionSizeMethodIndex].method !== method) return false;

  if (food.portionSize !== null)
    if (food.portionSize.method !== method) {
      console.warn(
        `Selected portion size method is ${method} but portion size data is for ${food.portionSize.method}`
      );
      return false;
    }

  return true;
}

export function asServedComplete(food: FoodState): boolean {
  if (
    food.type !== 'encoded-food' ||
    !food.portionSize ||
    !food.flags.includes('portion-size-method-complete')
  )
    return false;

  if (food.portionSize.method !== 'as-served') {
    console.warn(
      `Selected portion size method is "as-served" but portion size data is for ${food.portionSize.method}`
    );
    return false;
  }

  return food.portionSize.serving !== null;
}

export function cerealComplete(food: FoodState): boolean {
  if (
    food.type !== 'encoded-food' ||
    !food.portionSize ||
    !food.flags.includes('portion-size-method-complete')
  )
    return false;

  if (food.portionSize.method !== 'cereal') {
    console.warn(
      `Selected portion size method is "cereal" but portion size data is for ${food.portionSize.method}`
    );
    return false;
  }

  return food.portionSize.servingWeight !== null;
}

export function guideImageComplete(food: FoodState): boolean {
  if (
    food.type !== 'encoded-food' ||
    !food.portionSize ||
    !food.flags.includes('portion-size-method-complete')
  )
    return false;

  if (food.portionSize.method !== 'guide-image') {
    console.warn(
      `Selected portion size method is "guide-image" but portion size data is for ${food.portionSize.method}`
    );
    return false;
  }

  return food.portionSize.servingWeight !== null;
}

export function drinkScaleComplete(food: FoodState): boolean {
  if (
    food.type !== 'encoded-food' ||
    !food.portionSize ||
    !food.flags.includes('portion-size-method-complete')
  )
    return false;

  if (food.portionSize.method !== 'drink-scale') {
    console.warn(
      `Selected portion size method is "drink-scale" but portion size data is for ${food.portionSize.method}`
    );
    return false;
  }

  return (
    food.portionSize.imageUrl !== null &&
    food.portionSize.servingWeight !== null &&
    food.portionSize.drinkwareId !== null
  );
}

export function milkInAHotDrinkComplete(food: FoodState): boolean {
  if (
    food.type !== 'encoded-food' ||
    !food.portionSize ||
    !food.flags.includes('portion-size-method-complete')
  )
    return false;

  if (food.portionSize.method !== 'milk-in-a-hot-drink') {
    console.warn(
      `Selected portion size method is "milk-in-a-hot-drink" but portion size data is for ${food.portionSize.method}`
    );
    return false;
  }

  return food.portionSize.milkPartIndex !== null && food.portionSize.milkVolumePercentage !== null;
}

export function milkOnCerealComplete(food: FoodState): boolean {
  if (
    food.type !== 'encoded-food' ||
    !food.portionSize ||
    !food.flags.includes('portion-size-method-complete')
  )
    return false;

  if (food.portionSize.method !== 'milk-on-cereal') {
    console.warn(
      `Selected portion size method is "milk-on-cereal" but portion size data is for ${food.portionSize.method}`
    );
    return false;
  }

  return food.portionSize.bowlIndex !== undefined && food.portionSize.milkLevelIndex !== undefined;
}

export function parentFoodPortionComplete(food: FoodState) {
  if (
    food.type !== 'encoded-food' ||
    !food.portionSize ||
    !food.flags.includes('portion-size-method-complete')
  )
    return false;

  if (food.portionSize.method !== 'parent-food-portion') {
    console.warn(
      `Selected portion size method is "parent-food-portion" but portion size data is for ${food.portionSize.method}`
    );
    return false;
  }

  return food.portionSize.portionIndex !== null && food.portionSize.portionValue !== null;
}

export function pizzaComplete(food: FoodState): boolean {
  if (
    food.type !== 'encoded-food' ||
    !food.portionSize ||
    !food.flags.includes('portion-size-method-complete')
  )
    return false;

  if (food.portionSize.method !== 'pizza') {
    console.warn(
      `Selected portion size method is "pizza" but portion size data is for ${food.portionSize.method}`
    );
    return false;
  }

  return food.portionSize.servingWeight !== null;
}

export function standardPortionComplete(food: FoodState): boolean {
  if (
    food.type !== 'encoded-food' ||
    !food.portionSize ||
    !food.flags.includes('portion-size-method-complete')
  )
    return false;

  if (food.portionSize.method !== 'standard-portion') {
    console.warn(
      `Selected portion size method is "standard-portion" but portion size data is for ${food.portionSize.method}`
    );
    return false;
  }

  return food.portionSize.servingWeight !== null;
}

export function weightComplete(food: FoodState): boolean {
  if (
    food.type !== 'encoded-food' ||
    !food.portionSize ||
    !food.flags.includes('portion-size-method-complete')
  )
    return false;

  if (food.portionSize.method !== 'standard-portion') {
    console.warn(
      `Selected portion size method is "standard-portion" but portion size data is for ${food.portionSize.method}`
    );
    return false;
  }

  return food.portionSize.servingWeight !== null;
}

export const portionSizeCompleteChecks = {
  'as-served': asServedComplete,
  cereal: cerealComplete,
  'drink-scale': drinkScaleComplete,
  'guide-image': guideImageComplete,
  'milk-in-a-hot-drink': milkInAHotDrinkComplete,
  'milk-on-cereal': milkOnCerealComplete,
  'parent-food-portion': parentFoodPortionComplete,
  pizza: pizzaComplete,
  'standard-portion': standardPortionComplete,
  weight: weightComplete,
};

export const isPortionSizeComplete = (food: FoodState): boolean => {
  if (food.type !== 'encoded-food' || !food.portionSize) return false;

  return portionSizeCompleteChecks[food.portionSize.method](food);
};

export const missingFoodComplete = (food: MissingFood): boolean =>
  !!(food.info && food.flags.includes('missing-food-complete'));
