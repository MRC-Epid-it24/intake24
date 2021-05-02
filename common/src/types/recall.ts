import type { Prompt, PromptAnswer, PromptStatus, PromptQuestion, Dictionary } from '.';
import { UserFoodData } from './http';
import { PortionSizeMethodId } from './models';

/* export enum RecallSections {
  PRE_MEALS = 'preMeals',
  MEALS = 'meals',
  POST_MEALS = 'postMeals',
  SUBMISSION = 'submission',
}

export enum MealSections {
  PRE_FOODS = 'preFoods',
  FOODS = 'foods',
  POST_FOODS = 'postFoods',
} */

export type QuestionSection = 'preMeals' | 'postMeals' | 'submission';

export type RecallSection = QuestionSection | 'meals';

export type MealSection = 'preFoods' | 'foods' | 'postFoods';

export type MealQuestionSection = 'preFoods' | 'postFoods';

export type GenericQuestions = Record<QuestionSection, PromptQuestion[]>;

export type MealQuestions = Record<MealSection, PromptQuestion[]>;

export interface RecallQuestions extends GenericQuestions {
  meals: MealQuestions;
}

/* export interface Food {
  brand: string;
  data: Dictionary;
  searchTerm: string;
} */

// TODO: implement distinct selection types for survey/meal/food level
export type Selection = {
  section: RecallSection;
  mealSection?: MealSection;
  mealIdx?: number;
  promptIdx: number;
  prompt: Prompt;
};

export type PromptState = {
  questionId: string;
  answer: PromptAnswer;
  status: PromptStatus;
};

export type MealState = {
  name: string;
  time: string;
  flags: string[];

  preFoods: PromptState[];
  postFoods: PromptState[];
};

export type RecallState = {
  schemeId: string;
  startTime: Date | null;
  endTime: Date | null;
  flags: string[];

  preMeals: PromptState[];
  meals: MealState[];
  postMeals: PromptState[];
  submission: PromptState[];
};

// Types for version 3 style dynamic survey flow logic

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

export type PortionSizeState = AsServedState;

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

export interface MealState2 {
  name: string;
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

export interface Selection2 {
  element: SelectedMeal | SelectedFood | null;
  mode: SelectionMode;
}

export type SurveyState = {
  schemeId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  flags: string[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;

  selection: Selection2;
  meals: MealState2[];
};
