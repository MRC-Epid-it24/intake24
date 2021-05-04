import { FoodState } from '@common/types';
import { PortionSizeMethodId } from '@common/types/models';

// eslint-disable-next-line import/prefer-default-export
export function portionSizeMethodSelected(
  selectedFood: FoodState,
  method: PortionSizeMethodId
): boolean {
  if (selectedFood.type !== 'encoded-food') return false;

  if (selectedFood.portionSizeMethodIndex == null) return false;

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
