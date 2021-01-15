import { Prompt, PromptQuestion } from './prompts';

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

export interface MealDefinition {
  name: string;
  time: string;
}

export interface Scheme {
  id: string;
  name: string;
  type: string;
  questions: RecallQuestions;
  meals: MealDefinition[];
}

/* export interface Food {
  brand: string;
  data: Dictionary;
  searchTerm: string;
} */

export interface Selection {
  section: RecallSection;
  mealSection?: MealSection;
  index: number;
  prompt: Prompt;
}
