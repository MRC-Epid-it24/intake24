import { PromptQuestion } from './prompts';

export enum RecallSections {
  PRE_MEALS = 'preMeals',
  MEALS = 'meals',
  POST_MEALS = 'postMeals',
  SUBMISSION = 'submission',
}

export enum MealSections {
  PRE_FOODS = 'preFoods',
  FOODS = 'foods',
  POST_FOODS = 'postFoods',
}

export type RecallSection = RecallSections;

export type QuestionSection = 'preMeals' | 'postMeals' | 'submission';

export type MealSection = MealSections;

export type MealQuestionSection = 'preFoods' | 'postFoods';

export type GenericQuestions = Record<QuestionSection, PromptQuestion[]>;

export interface RecallQuestions extends GenericQuestions {
  meals: MealQuestions;
}

export type MealQuestions = Record<MealSection, PromptQuestion[]>;
