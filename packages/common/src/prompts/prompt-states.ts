import type { FoodState, MissingFood, PortionSizeStates } from '../types';
import type { FoodHeader } from '../types/http';

export type AssociatedFoodPromptItemState = {
  confirmed?: 'yes' | 'no' | 'existing' | 'missing';
  selectedFood?: FoodHeader;
  existingFoodId?: string;
};

export type PromptStates = {
  'as-served-prompt': {
    portionSize: PortionSizeStates['as-served'];
    panel: number;
    servingImageConfirmed: boolean;
    leftoversImageConfirmed: boolean;
    leftoversPrompt?: boolean;
    linkedQuantity: number;
    linkedQuantityConfirmed: boolean;
  };
  'cereal-prompt': {
    portionSize: PortionSizeStates['cereal'];
    panel: number;
    bowlConfirmed: boolean;
    servingImageConfirmed: boolean;
    leftoversImageConfirmed: boolean;
    leftoversPrompt?: boolean;
  };
  'direct-weight-prompt': never;
  'drink-scale-prompt': {
    portionSize: PortionSizeStates['drink-scale'];
    panel: number;
    objectConfirmed: boolean;
    quantityConfirmed: boolean;
    leftoversConfirmed: boolean;
    leftoversPrompt?: boolean;
    countConfirmed: boolean;
  };
  'guide-image-prompt': {
    portionSize: PortionSizeStates['guide-image'];
    panel: number;
    objectConfirmed: boolean;
    quantityConfirmed: boolean;
  };
  'milk-in-a-hot-drink-prompt': {
    portionSize: PortionSizeStates['milk-in-a-hot-drink'];
    panel: number;
  };
  'milk-on-cereal-prompt': {
    portionSize: PortionSizeStates['milk-on-cereal'];
    panel: number;
    bowlConfirmed: boolean;
    milkLevelConfirmed: boolean;
  };
  'missing-food-prompt': {
    info: NonNullable<MissingFood['info']>;
    panel: number;
    homemadePrompt?: boolean;
  };
  'parent-food-portion-prompt': {
    portionSize: PortionSizeStates['parent-food-portion'];
    panel: number;
  };
  'pizza-prompt': {
    portionSize: PortionSizeStates['pizza'];
    panel: number;
    confirmed: {
      type: boolean;
      thickness: boolean;
      slice: boolean;
      quantity: boolean;
    };
  };
  'portion-size-option-prompt': {
    option: number | null;
  };
  'standard-portion-prompt': {
    portionSize: PortionSizeStates['standard-portion'];
    panel: number;
    quantityConfirmed: boolean;
  };
  // Standard prompts
  'edit-meal-prompt': {
    foods: FoodState[];
  };
  'associated-foods-prompt': {
    activePrompt: number;
    prompts: AssociatedFoodPromptItemState[];
  };
};

export type PromptState = PromptStates[keyof PromptStates];
