import type { Dictionary, RequiredLocaleTranslation } from '@intake24/common/types';

import type { ComponentType, QuantityValues } from '../prompts';
import type { FoodHeader, UserFoodData } from './http';

export type CustomPromptAnswer = string | string[] | number | number[];

export const portionSizeMethods = [
  'as-served',
  'guide-image',
  'drink-scale',
  'standard-portion',
  'cereal',
  'milk-on-cereal',
  'pizza',
  'milk-in-a-hot-drink',
  'weight',
];

export type PortionSizeMethodId = typeof portionSizeMethods[number];

export interface PortionSizeStateBase {
  method: PortionSizeMethodId;
  servingWeight: number | null;
  leftoversWeight: number | null;
}

export interface SelectedAsServedImage {
  index: number;
  weight: number;
}

export interface AsServedState extends PortionSizeStateBase {
  method: 'as-served';
  serving: SelectedAsServedImage | null;
  leftovers: SelectedAsServedImage | null;
}

export interface SelectedGuideImageObject {
  id: number;
  weight: number;
}

export interface GuideImageState extends PortionSizeStateBase {
  method: 'guide-image';
  object: SelectedGuideImageObject | null;
  quantity: QuantityValues;
}

export interface DrinkScaleState extends PortionSizeStateBase {
  method: 'drink-scale';
  leftoversLevel: number;
  initialFillLevel: string;
  fillLevel: number;
  skipFillLevel: string;
  imageUrl: string;
  leftoversWeight: number;
  drinkwareId: string;
  containerIndex: number;
  leftovers: boolean;
  servingWeight: number;
}

export interface StandardPortionUnit {
  name: string;
  weight: number;
  omitFoodDescription: boolean;
}

export interface StandardPortionState extends PortionSizeStateBase {
  method: 'standard-portion';
  unit: StandardPortionUnit | null;
  quantity: QuantityValues | null;
}

export type PortionSizeState =
  | AsServedState
  | GuideImageState
  | StandardPortionState
  | DrinkScaleState;

export interface AssociatedFoodPromptState {
  confirmed: boolean | undefined;
  selectedFood: FoodHeader | undefined;
}

export interface AssociatedFoodsState {
  activePrompt: number;
  prompts: AssociatedFoodPromptState[];
}

export interface AbstractFoodState {
  id: number;
  flags: string[];
  // eslint-disable-next-line no-use-before-define
  linkedFoods: FoodState[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
}

export interface FreeTextFood extends AbstractFoodState {
  type: 'free-text';
  description: string;
}

export interface EncodedFood extends AbstractFoodState {
  type: 'encoded-food';
  data: UserFoodData;
  portionSizeMethodIndex: number | null;
  portionSize: PortionSizeState | null;
  associatedFoodsComplete: boolean;
}

export type FoodState = FreeTextFood | EncodedFood;

export interface FoodEntry {
  text: string;
  disabled: boolean;
}

export interface MealTime {
  hours: number;
  minutes: number;
}

export interface MealState {
  id: number;
  name: RequiredLocaleTranslation;
  defaultTime: MealTime;
  time: MealTime | undefined;
  flags: string[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;

  foods: FoodState[];
}

export interface SelectedMeal {
  type: 'meal';
  mealId: number;
}

export interface SelectedFood {
  type: 'food';
  foodId: number;
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
  schemeId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  flags: string[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
  continueButtonEnabled: boolean;
  tempPromptAnswer?: PromptAnswer;
  selection: Selection;
  meals: MealState[];
  nextFoodId: number;
  nextMealId: number;
};

export interface RecallPromptHandler {
  commitAnswer(): Promise<void>;
}
