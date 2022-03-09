import type { Dictionary, LocaleTranslation } from '@intake24/common/types';
import type { ComponentType, QuantityValues } from '../prompts';
import { UserFoodData } from './http';
import { PortionSizeMethodId } from './models';

export type CustomPromptAnswer = string | string[] | number | number[];

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
  quantity: QuantityValues | null;
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

export type PortionSizeState = AsServedState | GuideImageState | StandardPortionState;

export interface FreeTextFood {
  type: 'free-text';
  description: string;
  flags: string[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
}

export interface EncodedFood {
  type: 'encoded-food';
  data: UserFoodData;
  flags: string[];
  portionSizeMethodIndex: number | null;
  portionSize: PortionSizeState | null;
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
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
  name: string;
  localName: LocaleTranslation;
  defaultTime: MealTime;
  time: MealTime | undefined;
  flags: string[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;

  foods: FoodState[];
}

export interface SelectedMeal {
  type: 'meal';
  mealIndex: number;
}

export interface SelectedFood {
  type: 'food';
  mealIndex: number;
  foodIndex: number;
}

export type SelectionMode = 'manual' | 'auto';

export interface Selection {
  element: SelectedMeal | SelectedFood | null;
  mode: SelectionMode;
}

export type PromptAnswerResponce =
  | FoodState[]
  | string
  | FoodEntry
  | PortionSizeState
  | null
  | number;

export interface PromptAnswer {
  response: PromptAnswerResponce;
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
  tempPromptAnswer?: PromptAnswer;
  selection: Selection;
  meals: MealState[];
};

export interface HasOnAnswer {
  onPartialAnswer(value?: PromptAnswerResponce): void;
  onAnswer(value?: PromptAnswerResponce): void;
}

export interface HasPartialAnswerTriggerHandler {
  partialAnswerHandler(): void;
}
