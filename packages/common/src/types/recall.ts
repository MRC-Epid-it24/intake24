import { z } from 'zod';

import type { SurveySubmissionMissingFoodCreationAttributes } from '@intake24/db';

import type { ComponentType, ExternalSource, PromptStates } from '../prompts';
import type { CerealType, StandardUnit } from '../surveys';
import type { RecipeFood } from './foods';
import type { UserFoodData } from './http';
import { type Dictionary, type Optional, requiredLocaleTranslation } from './common';

/*
Not currently used:
private static final String FLAG_CONFIRMED_NO_DRINKS = "confirmed-no-drinks";
private static final String FLAG_ASSOCIATED_FOODS_COMPLETE = "associated-foods-complete";
*/

export const staticSurveyFlag = [
] as const;
export type StaticSurveyFlag = (typeof staticSurveyFlag)[number];
export const dynamicSurveyFlag = z.custom<`${string}-acknowledged` | `${string}-complete`>((val) => {
  return typeof val === 'string' && /-(?:acknowledged|complete)$/.test(val);
});
export type DynamicSurveyFlag = z.infer<typeof dynamicSurveyFlag>;
// export const surveyFlag = z.union([z.enum(staticSurveyFlag), dynamicSurveyFlag]);
export const surveyFlag = z.union([dynamicSurveyFlag, z.string()]);
export type SurveyFlag = z.infer<typeof surveyFlag>;

export const staticMealFlag = [
  'free-entry-complete',
  'no-meals-after',
  'no-meals-between',
  'no-meals-before',
  'ready-meal-complete',
  'meal-time:hidden',
  'meal-time:disabled',
] as const;
export type StaticMealFlag = (typeof staticMealFlag)[number];
export const dynamicMealFlag = z.custom<`food-search:${string}` | `${string}-acknowledged` | `${string}-complete`>((val) => {
  return typeof val === 'string' && (val.startsWith('food-search:') || /-(?:acknowledged|complete)$/.test(val));
});
export type DynamicMealFlag = z.infer<typeof dynamicMealFlag>;
export const mealFlag = z.union([z.enum(staticMealFlag), dynamicMealFlag, z.string()]);
export type MealFlag = z.infer<typeof mealFlag>;

export const staticFoodFlag = [
  'is-drink',
  'link-as-main',
  'ready-meal',
  'same-as-before-complete',
  'split-food-complete',
  'missing-food-complete',
  'portion-size-option-complete',
  'portion-size-method-complete',
  'recipe-builder-complete',
  'associated-foods-complete',
  'disable-general-associated-foods',
] as const;
export type StaticFoodFlag = (typeof staticFoodFlag)[number];
export const dynamicFoodFlag = z.custom<`${string}-acknowledged` | `${string}-complete`>((val) => {
  return typeof val === 'string' && /-(?:acknowledged|complete)$/.test(val);
});
export type DynamicFoodFlag = z.infer<typeof dynamicFoodFlag>;
export const foodFlag = z.union([z.enum(staticFoodFlag), dynamicFoodFlag, z.string()]);
export type FoodFlag = z.infer<typeof foodFlag>;

export const customPromptAnswer = z.union([z.string(), z.array(z.string()), z.number(), z.array(z.number()), z.boolean(), z.array(z.boolean()), z.null()]);
export type CustomPromptAnswer = z.infer<typeof customPromptAnswer>;

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
  'direct-weight': PortionSizeStateBase & {
    method: 'direct-weight';
    quantity: number | null;
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
  'recipe-builder': PortionSizeStateBase & { method: 'recipe-builder' };
  'standard-portion': PortionSizeStateBase & {
    method: 'standard-portion';
    unit: StandardUnit | null;
    quantity: number;
    linkedQuantity: number;
  };
};

export type PortionSizeState = PortionSizeStates[keyof PortionSizeStates];

export const recipeBuilderComponent = z.object({
  order: z.number(),
  ingredients: z.string().array(),
});
export type RecipeBuilderComponent = z.infer<typeof recipeBuilderComponent>;

export type RecipeBuilderLinkedFood = {
  id: string;
  linkedTo: string[];
};

export type GetPortionSizeState<P extends keyof PortionSizeStates> = PortionSizeStates[P];

export type ExternalSourceRecord = Record<ExternalSource, PromptStates['external-source-prompt'] | undefined>;

export interface AbstractFoodState {
  id: string;
  flags: FoodFlag[];
  linkedFoods: FoodState[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
  type: 'free-text' | 'encoded-food' | 'missing-food' | 'recipe-builder';
  external?: ExternalSourceRecord;
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

export const mealTime = z.object({
  hours: z.number(),
  minutes: z.number(),
});

export type MealTime = z.infer<typeof mealTime>;

export const mealState = z.object({
  id: z.string(),
  name: requiredLocaleTranslation,
  defaultTime: mealTime,
  time: mealTime.optional(),
  duration: z.number().nullable(),
  flags: mealFlag.array(),
  customPromptAnswers: z.record(z.string(), customPromptAnswer),
  // TODO: type foods
  foods: z.custom<FoodState>(() => {
    return true;
  }).array(),
});

export type MealState = z.infer<typeof mealState>;

export type MealCreationState = Optional<
  Pick<MealState, 'name' | 'defaultTime' | 'time' | 'duration' | 'flags'>,
  'defaultTime' | 'time' | 'duration' | 'flags'
>;

export const selectedMeal = z.object({
  type: z.literal('meal'),
  mealId: z.string(),
});
export type SelectedMeal = z.infer<typeof selectedMeal>;

export const selectedFood = z.object({
  type: z.literal('food'),
  foodId: z.string(),
});
export type SelectedFood = z.infer<typeof selectedFood>;

export const selectionModes = ['manual', 'auto'] as const;
export const selectionMode = z.enum(selectionModes);

export type SelectionMode = (typeof selectionModes)[number];

export const selection = z.object({
  element: z.union([z.null(), selectedMeal, selectedFood]),
  mode: selectionMode,
});

export type Selection = z.infer<typeof selection>;

export type PromptAnswerResponse =
  | FoodState[]
  | string
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

export const surveyState = z.object({
  id: z.string().uuid().optional(),
  schemeId: z.string().nullable(),
  recallDate: z.string().date().nullable(),
  startTime: z.coerce.date().nullable(),
  endTime: z.coerce.date().nullable(),
  submissionTime: z.coerce.date().nullable(),
  uxSessionId: z.string().uuid(),
  userAgent: z.string().nullish(),
  flags: surveyFlag.array(),
  customPromptAnswers: z.record(customPromptAnswer),
  selection,
  meals: mealState.array(),
});

export type SurveyState = z.infer<typeof surveyState>;

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
      return food.searchTerm ?? '';
  }
}

export function getSearchTerm(food: FoodState) {
  switch (food.type) {
    case 'free-text':
      return food.description;
    default:
      return food.searchTerm;
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
