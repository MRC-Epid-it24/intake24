import type { Prompt, PromptWithSection } from '../prompts';
import type { Meal } from '../types';

export const schemeTypes = ['default'] as const;
export type SchemeType = (typeof schemeTypes)[number];

export const surveySections = ['preMeals', 'postMeals', 'submission'] as const;
export type SurveyQuestionSection = (typeof surveySections)[number];

export const mealSections = ['preFoods', 'foods', 'postFoods'] as const;
export type MealSection = (typeof mealSections)[number];

export const mealQuestionSections = ['preFoods', 'postFoods'] as const;
export type MealQuestionSection = (typeof mealQuestionSections)[number];

export const isMealSection = (section: any): section is MealSection => {
  return mealSections.includes(section);
};

export const isSurveySection = (section: any): section is SurveyQuestionSection => {
  return surveySections.includes(section);
};

export type SurveySection = SurveyQuestionSection | 'meals';

export type GenericQuestions = Record<SurveyQuestionSection, Prompt[]>;

export type MealQuestions = Record<MealSection, Prompt[]>;

export interface RecallQuestions extends GenericQuestions {
  meals: MealQuestions;
}

export const flattenScheme = (scheme: RecallQuestions): Prompt[] =>
  Object.values(scheme).reduce<Prompt[]>((acc, questions) => {
    acc.push(...(Array.isArray(questions) ? questions : flattenScheme(questions)));
    return acc;
  }, []);

export const flattenSchemeWithSection = (scheme: RecallQuestions): PromptWithSection[] =>
  Object.entries(scheme).reduce<PromptWithSection[]>((acc, [section, questions]) => {
    const items = Array.isArray(questions)
      ? questions.map((question) => ({ ...question, section }))
      : flattenSchemeWithSection(questions);

    acc.push(...items);
    return acc;
  }, []);

export const defaultMeals: Meal[] = [
  { name: { en: 'Breakfast' }, time: '8:00' },
  { name: { en: 'Morning snack' }, time: '10:00' },
  { name: { en: 'Lunch' }, time: '13:00' },
  { name: { en: 'Afternoon snack' }, time: '16:00' },
  { name: { en: 'Dinner' }, time: '18:00' },
  { name: { en: 'Evening snack' }, time: '20:00' },
];

export type ExportSectionId =
  | 'user'
  | 'userCustom'
  | 'survey'
  | 'surveyCustom'
  | 'meal'
  | 'mealCustom'
  | 'food'
  | 'foodCustom'
  | 'foodNutrients'
  | 'foodFields'
  | 'portionSizes';

export type ExportField = {
  id: string;
  label: string;
};

export type ExportSection = {
  id: ExportSectionId;
  fields: ExportField[];
};

export type ExportSections = ExportSection[];

export const defaultExport: ExportSection[] = [
  { id: 'user', fields: [] },
  { id: 'userCustom', fields: [] },
  { id: 'survey', fields: [] },
  { id: 'surveyCustom', fields: [] },
  { id: 'meal', fields: [] },
  { id: 'mealCustom', fields: [] },
  { id: 'food', fields: [] },
  { id: 'foodCustom', fields: [] },
  { id: 'foodFields', fields: [] },
  { id: 'foodNutrients', fields: [] },
  { id: 'portionSizes', fields: [] },
];

export const defaultQuestions: RecallQuestions = {
  preMeals: [],
  meals: {
    preFoods: [],
    foods: [],
    postFoods: [],
  },
  postMeals: [],
  submission: [],
};

export type SchemeOverrides = {
  meals: Meal[];
  questions: Prompt[];
};

export const defaultOverrides: SchemeOverrides = {
  meals: [],
  questions: [],
};
