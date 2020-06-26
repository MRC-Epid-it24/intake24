import { AnyDictionary } from '@/types/common';

export enum PromptStatuses {
  INITIAL = 'initial',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  ERROR = 'error',
}

export type PromptStatus = PromptStatuses;

/* export enum RecallSections {
  PRE_MEALS = 'preMeals',
  MEALS = 'meals',
  POST_MEALS = 'postMeals',
  SUBMISSION = 'submission',
} */

export type QuestionSection = 'preMeals' | 'postMeals' | 'submission';

export type RecallSection = QuestionSection | 'meals';

/* export enum MealSections {
  PRE_FOODS = 'preFoods',
  FOODS = 'foods',
  POST_FOODS = 'postFoods',
} */

export type MealSection = 'preFoods' | 'foods' | 'postFoods';

export type MealQuestionSection = 'preFoods' | 'postFoods';

export type GenericQuestions = Record<QuestionSection, PromptQuestion[]>;

export interface RecallQuestions extends GenericQuestions {
  meals: MealQuestions;
}

export type MealQuestions = Record<MealSection, PromptQuestion[]>;

export interface Scheme {
  id: string;
  name: string;
  type: string;
  questions: RecallQuestions;
  meals: MealDefinition[];
}

export interface MealDefinition {
  name: string;
  time: string;
}

/* export interface Food {
  brand: string;
  data: AnyDictionary;
  searchTerm: string;
} */

export interface Prompt<T = AnyDictionary> {
  question: PromptQuestion<T>;
  answer: PromptAnswer;
  status: PromptStatus;
}

export interface PromptQuestion<T = AnyDictionary> {
  id: string;
  name: string;
  component: string;
  props: T;
}

export type PromptAnswer = string | string[] | null;

export interface Selection {
  section: RecallSection;
  mealSection?: MealSection;
  index: number;
  prompt: Prompt;
}
