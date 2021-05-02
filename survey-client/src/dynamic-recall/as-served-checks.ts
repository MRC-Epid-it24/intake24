import { FoodState } from '@common/types';

export function asServedSelected(selectedFood: FoodState) {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSizeMethodIndex == null) return false;

  if (
    selectedFood.data.portionSizeMethods[selectedFood.portionSizeMethodIndex].method !== 'as-served'
  )
    return false;

  if (selectedFood.portionSize != null) {
    if (selectedFood.portionSize.method !== 'as-served') {
      console.warn(
        `Selected portion size method is "as-served" but portion size data is for ${selectedFood.portionSize.method}`
      );
      return false;
    }
  }

  return true;
}

export function asServedServingComplete(selectedFood: FoodState) {
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

export function asServedLeftoversComplete(selectedFood: FoodState) {
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
