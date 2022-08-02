import type { FoodState } from '@intake24/common/types';
import type { PortionSizeMethodId } from '@intake24/common/types/models';

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

export function asServedServingComplete(selectedFood: FoodState): boolean {
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

export function asServedLeftoversComplete(selectedFood: FoodState): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSize != null) {
    if (selectedFood.portionSize.method !== 'as-served') {
      console.warn(
        `Selected portion size method is "as-served" but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }

    return selectedFood.portionSize.leftovers != null;
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

    return selectedFood.portionSize.object != null && selectedFood.portionSize.quantity != null;
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
      selectedFood.portionSize.object != null &&
      selectedFood.portionSize.servingWeight != null &&
      selectedFood.portionSize.drinkwareId != null
    );
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

    return selectedFood.portionSize.unit != null && selectedFood.portionSize.quantity != null;
  }

  return false;
}
