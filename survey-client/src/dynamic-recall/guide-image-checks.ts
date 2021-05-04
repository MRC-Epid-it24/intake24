import { FoodState } from '@common/types';

// eslint-disable-next-line import/prefer-default-export
export function guideImageComplete(selectedFood: FoodState) {
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
