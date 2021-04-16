import type { Prompt, PromptAnswer, PromptStatus, PromptQuestion, Dictionary } from '.';
import { UserFoodData } from './http';

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
  schemeId: string | null;
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
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
}

export type FoodState = FreeTextFood | EncodedFood;

export interface MealTime {
  hours: number;
  minutes: number;
}

export interface MealState2 {
  name: string;
  time: MealTime;
  flags: string[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;

  foods: FoodState[];
}

export type SurveyState = {
  schemeId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  flags: string[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;

  meals: MealState[];
};
