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

export interface Selection {
  section: RecallSection;
  mealSection?: MealSection;
  index: number;
  prompt: Prompt;
}
