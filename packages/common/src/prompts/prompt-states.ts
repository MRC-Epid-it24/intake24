import type {
  AsServedState,
  CerealState,
  DrinkScaleState,
  FoodState,
  GuideImageState,
  MilkInAHotDrinkState,
  MilkOnCerealState,
  MissingFood,
  PizzaState,
  StandardPortionState,
} from '../types';
import type { FoodHeader } from '../types/http';

export type AssociatedFoodPromptItemState = {
  confirmed: 'yes' | 'no' | 'existing' | undefined;
  selectedFood: FoodHeader | undefined;
  existingFoodId: string | undefined;
};

export type PromptStates = {
  'as-served-prompt': {
    portionSize: AsServedState;
    panel: number;
    servingImageConfirmed: boolean;
    leftoversImageConfirmed: boolean;
    leftoversPrompt?: boolean;
    linkedQuantity: number;
    linkedQuantityConfirmed: boolean;
  };
  'cereal-prompt': {
    portionSize: CerealState;
    panel: number;
    bowlConfirmed: boolean;
    servingImageConfirmed: boolean;
    leftoversImageConfirmed: boolean;
    leftoversPrompt?: boolean;
  };
  'direct-weight-prompt': never;
  'drink-scale-prompt': {
    portionSize: DrinkScaleState;
    panel: number;
    objectConfirmed: boolean;
    quantityConfirmed: boolean;
    leftoversConfirmed: boolean;
    leftoversPrompt?: boolean;
  };
  'guide-image-prompt': {
    portionSize: GuideImageState;
    panel: number;
    objectConfirmed: boolean;
    quantityConfirmed: boolean;
  };
  'milk-in-a-hot-drink-prompt': {
    portionSize: MilkInAHotDrinkState;
    panel: number;
  };
  'milk-on-cereal-prompt': {
    portionSize: MilkOnCerealState;
    panel: number;
    bowlConfirmed: boolean;
    milkLevelConfirmed: boolean;
  };
  'missing-food-prompt': {
    info: NonNullable<MissingFood['info']>;
    panel: number;
  };
  'pizza-prompt': {
    portionSize: PizzaState;
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
    portionSize: StandardPortionState;
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
