import type { Prompt, PromptWithSection } from '../prompts';
import type { Meal } from '../types';

export const schemeTypes = ['default'] as const;
export type SchemeType = (typeof schemeTypes)[number];

export const surveySections = ['preMeals', 'postMeals', 'submission'] as const;
export type SurveyPromptSection = (typeof surveySections)[number];

export const mealSections = ['preFoods', 'foods', 'postFoods'] as const;
export type MealSection = (typeof mealSections)[number];

export const isMealSection = (section: any): section is MealSection => {
  return mealSections.includes(section);
};

export const isSurveySection = (section: any): section is SurveyPromptSection => {
  return surveySections.includes(section);
};

export type SurveySection = SurveyPromptSection | 'meals';

export type PromptSection = SurveyPromptSection | MealSection;

export type GenericPrompts = Record<SurveyPromptSection, Prompt[]>;

export type MealPrompts = Record<MealSection, Prompt[]>;

export interface RecallPrompts extends GenericPrompts {
  meals: MealPrompts;
}

export const flattenScheme = (scheme: RecallPrompts): Prompt[] =>
  Object.values(scheme).reduce<Prompt[]>((acc, prompts) => {
    acc.push(...(Array.isArray(prompts) ? prompts : flattenScheme(prompts)));
    return acc;
  }, []);

export const flattenSchemeWithSection = (scheme: RecallPrompts): PromptWithSection[] =>
  Object.entries(scheme).reduce<PromptWithSection[]>((acc, [section, prompts]) => {
    const items = Array.isArray(prompts)
      ? prompts.map((prompt) => ({ ...prompt, section }))
      : flattenSchemeWithSection(prompts);

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
  | 'submission'
  | 'submissionCustom'
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
  { id: 'submission', fields: [] },
  { id: 'submissionCustom', fields: [] },
  { id: 'meal', fields: [] },
  { id: 'mealCustom', fields: [] },
  { id: 'food', fields: [] },
  { id: 'foodCustom', fields: [] },
  { id: 'foodFields', fields: [] },
  { id: 'foodNutrients', fields: [] },
  { id: 'portionSizes', fields: [] },
];

export const defaultPrompts: RecallPrompts = {
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
  prompts: Prompt[];
};

export const defaultOverrides: SchemeOverrides = {
  meals: [],
  prompts: [],
};
