import { UserPortionSizeMethod } from '@/services/foods/types/user-portion-size-method';
import { UserAssociatedFoodPrompt } from '@/services/foods/types/user-associated-food-prompt';

export interface UserFoodData {
  code: string;
  englishDescription: string;
  localDescription: string;
  groupCode: number;
  kcalPer100g: number;
  reasonableAmount: number;
  readyMealOption: boolean;
  sameAsBeforeOption: boolean;
  portionSizeMethods: UserPortionSizeMethod[];
  associatedFoodPrompts: UserAssociatedFoodPrompt[];
  brandNames: string[];
}
