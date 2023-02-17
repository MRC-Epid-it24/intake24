import type { FoodState, MissingFood, PortionSizeMethodId } from '@intake24/common/types';

export function portionSizeMethodSelected(
  selectedFood: FoodState,
  method: PortionSizeMethodId
): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSizeMethodIndex === null) return false;

  if (selectedFood.data.portionSizeMethods[selectedFood.portionSizeMethodIndex].method !== method)
    return false;

  if (selectedFood.portionSize != null)
    if (selectedFood.portionSize.method !== method) {
      console.warn(
        `Selected portion size method is ${method} but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }

  return true;
}

export function asServedComplete(selectedFood: FoodState): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSize != null) {
    if (selectedFood.portionSize.method !== 'as-served') {
      console.warn(
        `Selected portion size method is "as-served" but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }

    return selectedFood.portionSize.serving != null;
  }

  return false;
}

export function cerealComplete(selectedFood: FoodState): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSize !== null) {
    if (selectedFood.portionSize.method !== 'cereal') {
      console.warn(
        `Selected portion size method is "cereal" but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }

    return selectedFood.portionSize.servingWeight !== null;
  }

  return false;
}

export function guideImageComplete(selectedFood: FoodState): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSize != null) {
    if (selectedFood.portionSize.method !== 'guide-image') {
      console.warn(
        `Selected portion size method is "guide-image" but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }

    return selectedFood.portionSize.servingWeight !== null;
  }

  return false;
}

export function drinkScaleComplete(selectedFood: FoodState): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSize != null) {
    if (selectedFood.portionSize.method !== 'drink-scale') {
      console.warn(
        `Selected portion size method is "drink-scale" but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }

    return (
      selectedFood.portionSize.imageUrl != null &&
      selectedFood.portionSize.servingWeight != null &&
      selectedFood.portionSize.drinkwareId != null
    );
  }

  return false;
}

export function milkInAHotDrinkComplete(selectedFood: FoodState): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSize !== null) {
    if (selectedFood.portionSize.method !== 'milk-in-a-hot-drink') {
      console.warn(
        `Selected portion size method is "milk-in-a-hot-drink" but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }

    return (
      selectedFood.portionSize.milkPartIndex !== null &&
      selectedFood.portionSize.milkVolumePercentage !== null
    );
  }

  return false;
}

export function milkOnCerealComplete(selectedFood: FoodState): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSize !== null) {
    if (selectedFood.portionSize.method !== 'milk-on-cereal') {
      console.warn(
        `Selected portion size method is "milk-on-cereal" but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }

    return (
      selectedFood.portionSize.bowlIndex !== undefined &&
      selectedFood.portionSize.milkLevelIndex !== undefined
    );
  }

  return false;
}

export function pizzaComplete(selectedFood: FoodState): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSize !== null) {
    if (selectedFood.portionSize.method !== 'pizza') {
      console.warn(
        `Selected portion size method is "pizza" but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }

    return selectedFood.portionSize.servingWeight !== null;
  }

  return false;
}

export function standardPortionComplete(selectedFood: FoodState): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSize != null) {
    if (selectedFood.portionSize.method !== 'standard-portion') {
      console.warn(
        `Selected portion size method is "standard-portion" but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }

    return selectedFood.portionSize.servingWeight !== null;
  }

  return false;
}

export const missingFoodComplete = (selectedFood: MissingFood): boolean => {
  return !selectedFood.info || Object.values(selectedFood.info).some((value) => !value)
    ? false
    : true;
};
