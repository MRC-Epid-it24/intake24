import type { Prompt, PromptAnswer, PromptStatus, PromptQuestion } from '.';

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
