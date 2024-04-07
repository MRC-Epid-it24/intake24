import type { SurveySubmissionMissingFoodCreationAttributes } from '@intake24/db';

import type { ComponentType } from '../prompts';
import type { Dictionary, Optional, RequiredLocaleTranslation } from './common';
import type { RecipeFood } from './foods';
import type { UserFoodData } from './http';
import type { CerealType, StandardUnit } from './portion-size';

/*
Not currently used:
private static final String FLAG_CONFIRMED_NO_DRINKS = "confirmed-no-drinks";
private static final String FLAG_ASSOCIATED_FOODS_COMPLETE = "associated-foods-complete";
*/

export type SurveyFlag = `${string}-acknowledged`;

export type MealFlag =
  | `food-search:${string}`
  | 'free-entry-complete'
  | 'no-meals-after'
  | 'no-meals-between'
  | 'no-meals-before'
  | 'ready-meal-complete'
  | `${string}-acknowledged`;

export type FoodFlag =
  | 'is-drink'
  | 'link-as-main'
  | 'ready-meal'
  | 'same-as-before-complete'
  | 'split-food-complete'
  | 'missing-food-complete'
  | 'portion-size-option-complete'
  | 'portion-size-method-complete'
  | 'recipe-builder-complete'
  | 'associated-foods-complete'
  | `${string}-acknowledged`;

export type CustomPromptAnswer = string | string[] | number | number[] | null;

export const pizzaSizes = ['personal', 'small', 'medium', 'large', 'xxl'] as const;
export type PizzaSize = (typeof pizzaSizes)[number];
export const pizzaCrusts = ['classic', 'italian-thin', 'stuffed'] as const;
export type PizzaCrust = (typeof pizzaCrusts)[number];

export const pizzaUnits = ['slice', 'whole'] as const;
export type PizzaUnit = (typeof pizzaUnits)[number];

// Portion size states
export interface PortionSizeStateBase {
  servingWeight: number | null;
  leftoversWeight: number | null;
}

export interface SelectedAsServedImage {
  asServedSetId: string;
  imageUrl: string;
  index: number;
  weight: number;
}

export interface SelectedGuideImageObject {
  guideImageId: string;
  imageUrl: string;
  id: number;
  weight: number;
}

export type PortionSizeStates = {
  'as-served': PortionSizeStateBase & {
    method: 'as-served';
    serving: SelectedAsServedImage | null;
    leftovers: SelectedAsServedImage | null;
    linkedQuantity: number;
  };
  cereal: PortionSizeStateBase & {
    method: 'cereal';
    imageUrl: string | null;
    type: CerealType;
    bowl: string | null;
    bowlId?: string;
    bowlIndex?: number;
    serving: SelectedAsServedImage | null;
    leftovers: SelectedAsServedImage | null;
  };
  'drink-scale': PortionSizeStateBase & {
    method: 'drink-scale';
    drinkwareId: string;
    initialFillLevel: number;
    skipFillLevel: boolean;
    imageUrl: string;
    containerId?: string;
    containerIndex?: number;
    fillLevel: number;
    leftoversLevel: number;
    leftovers: boolean;
    count: number;
  };
  'guide-image': PortionSizeStateBase & {
    method: 'guide-image';
    guideImageId: string;
    imageUrl: string | null;
    objectId?: string;
    objectIndex?: number;
    objectWeight: number;
    quantity: number;
    linkedQuantity: number;
  };
  'milk-in-a-hot-drink': PortionSizeStateBase & {
    method: 'milk-in-a-hot-drink';
    milkPartIndex: number | null;
    milkVolumePercentage: number | null;
  };
  'milk-on-cereal': PortionSizeStateBase & {
    method: 'milk-on-cereal';
    imageUrl: string | null;
    bowl: string | null;
    bowlId?: string;
    bowlIndex?: number;
    milkLevelId?: string;
    milkLevelIndex?: number;
    milkLevelImage: string | null;
  };
  'parent-food-portion': PortionSizeStateBase & {
    method: 'parent-food-portion';
    portionIndex: number | null;
    portionValue: number | null;
  };
  pizza: PortionSizeStateBase & {
    method: 'pizza';
    type: {
      id?: string;
      index?: number;
      image: string | null;
    };
    thickness: {
      id?: string;
      index?: number;
      image: string | null;
    };
    slice: {
      id?: string;
      index?: number;
      image: string | null;
      quantity: number;
    };
  };
  'pizza-v2': PortionSizeStateBase & {
    method: 'pizza-v2';
    size: PizzaSize | null;
    crust: PizzaCrust | null;
    unit: PizzaUnit | null;
    quantity: number;
  };
  'standard-portion': PortionSizeStateBase & {
    method: 'standard-portion';
    unit: StandardUnit | null;
    quantity: number;
    linkedQuantity: number;
  };
  'direct-weight': PortionSizeStateBase & { method: 'direct-weight' };
  'recipe-builder': PortionSizeStateBase & { method: 'recipe-builder' };
};

export type PortionSizeState = PortionSizeStates[keyof PortionSizeStates];
export type RecipeBuilderComponent = {
  order: number;
  ingredients: string[];
};

export type RecipeBuilderLinkedFood = {
  id: string;
  linkedTo: string[];
};

export type GetPortionSizeState<P extends keyof PortionSizeStates> = PortionSizeStates[P];

export interface AbstractFoodState {
  id: string;
  flags: FoodFlag[];
  linkedFoods: FoodState[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
  type: 'free-text' | 'encoded-food' | 'missing-food' | 'recipe-builder';
}

export interface FreeTextFood extends AbstractFoodState {
  type: 'free-text';
  description: string;
}

export interface EncodedFood extends AbstractFoodState {
  type: 'encoded-food';
  data: UserFoodData;
  searchTerm: string | null;
  portionSizeMethodIndex: number | null;
  portionSize: PortionSizeState | null;
  // brand: string[]; TODO V3?
}

export interface MissingFood extends AbstractFoodState {
  type: 'missing-food';
  searchTerm: string | null;
  info: Pick<
    SurveySubmissionMissingFoodCreationAttributes,
    'name' | 'brand' | 'description' | 'leftovers' | 'portionSize' | 'barcode'
  > | null;
}

export interface RecipeBuilder extends AbstractFoodState {
  type: 'recipe-builder';
  searchTerm: string | null;
  components: RecipeBuilderComponent[];
  description: string;
  templateId: string;
  template: RecipeFood;
  markedAsComplete: number[];
}

export type FoodState = FreeTextFood | EncodedFood | MissingFood | RecipeBuilder;

export interface FoodEntry {
  text: string;
  disabled: boolean;
}

export interface MealTime {
  hours: number;
  minutes: number;
}

export interface MealState {
  id: string;
  name: RequiredLocaleTranslation;
  defaultTime: MealTime;
  time: MealTime | undefined;
  duration: number | null;
  flags: MealFlag[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
  foods: FoodState[];
}

export type MealCreationState = Optional<
  Pick<MealState, 'name' | 'time' | 'duration' | 'flags'>,
  'flags' | 'time' | 'duration' | 'flags'
>;

export interface SelectedMeal {
  type: 'meal';
  mealId: string;
}

export interface SelectedFood {
  type: 'food';
  foodId: string;
}

export type SelectionMode = 'manual' | 'auto';

export interface Selection {
  element: SelectedMeal | SelectedFood | null;
  mode: SelectionMode;
}

export type PromptAnswerResponse =
  | FoodState[]
  | string
  | FoodEntry
  | PortionSizeState
  | null
  | number;

export interface PromptAnswer {
  response: PromptAnswerResponse;
  modified: boolean;
  new: boolean;
  finished: boolean;
  prompt: ComponentType | undefined;
  mealIndex: number | undefined;
  foodIndex: number | undefined;
}

export type SurveyState = {
  id?: string;
  schemeId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  submissionTime: Date | null;
  uxSessionId: string;
  userAgent?: string | null;
  flags: SurveyFlag[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
  selection: Selection;
  meals: MealState[];
};

export function isEncodedFood(food: FoodState): food is EncodedFood {
  return food.type === 'encoded-food';
}

export function getFoodDescription(food: FoodState): string {
  switch (food.type) {
    case 'free-text':
      return food.description;
    case 'encoded-food':
      return food.data.localName;
    default:
      return food.searchTerm ?? '??';
  }
}

export function isSelectionEqual(s1: Selection, s2: Selection): boolean {
  if (s1.mode === s2.mode) {
    if (s1.element !== null) {
      if (s2.element === null)
        return false;

      if (s1.element.type === 'food' && s2.element.type === 'food')
        return s1.element.foodId === s2.element.foodId;

      if (s1.element.type === 'meal' && s2.element.type === 'meal')
        return s1.element.mealId === s2.element.mealId;

      return false;
    }
    else {
      return s2.element === null;
    }
  }
  else {
    return false;
  }
}
