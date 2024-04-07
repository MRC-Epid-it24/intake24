import type { Condition, Prompt, PromptWithSection } from '../prompts';
import type { Meal } from '../types';

export const schemeTypes = ['default'] as const;
export type SchemeType = (typeof schemeTypes)[number];

export const surveySections = ['preMeals', 'postMeals', 'submission'] as const;
export type SurveyPromptSection = (typeof surveySections)[number];

export const mealSections = ['preFoods', 'foods', 'postFoods'] as const;
export type MealSection = (typeof mealSections)[number];

export function isMealSection(section: any): section is MealSection {
  return mealSections.includes(section);
}

export function isSurveySection(section: any): section is SurveyPromptSection {
  return surveySections.includes(section);
}

export type SurveySection = SurveyPromptSection | 'meals';

export type PromptSection = SurveyPromptSection | MealSection;

export type GenericPrompts = Record<SurveyPromptSection, Prompt[]>;

export type MealPrompts = Record<MealSection, Prompt[]>;

export interface RecallPrompts extends GenericPrompts {
  meals: MealPrompts;
}

export function flattenScheme(scheme: RecallPrompts): Prompt[] {
  return Object.values(scheme).reduce<Prompt[]>((acc, prompts) => {
    acc.push(...(Array.isArray(prompts) ? prompts : flattenScheme(prompts)));
    return acc;
  }, []);
}

export function flattenSchemeWithSection(scheme: RecallPrompts): PromptWithSection[] {
  return Object.entries(scheme).reduce<PromptWithSection[]>((acc, [section, prompts]) => {
    const items = Array.isArray(prompts)
      ? prompts.map(prompt => ({ ...prompt, section }))
      : flattenSchemeWithSection(prompts);

    acc.push(...items);
    return acc;
  }, []);
}

export function groupMultiPrompts(prompts: Prompt[]) {
  const grouped = prompts.reduce<
    Record<string, { idx: number; prompts: Prompt[]; conditions: Condition[]; inserted: boolean }>
  >((acc, item, idx) => {
    if (item.type !== 'custom' || !item.group)
      return acc;

    if (!acc[item.group])
      acc[item.group] = { idx, prompts: [], conditions: [], inserted: false };
    acc[item.group].prompts.push(item);
    acc[item.group].conditions.push(...item.conditions);

    return acc;
  }, {});

  if (!Object.keys(grouped).length)
    return prompts;

  return prompts.reduce<Prompt[]>((acc, item) => {
    if (item.type !== 'custom' || !item.group) {
      acc.push(item);
      return acc;
    }

    if (!grouped[item.group].inserted) {
      acc.push({
        id: `multiple-prompt-${item.group}`,
        type: 'custom',
        name: `multiple-prompt-${item.group}`,
        component: 'multi-prompt',
        prompts: grouped[item.group].prompts,
        i18n: {},
        conditions: grouped[item.group].conditions,
      });
      grouped[item.group].inserted = true;
    }
    return acc;
  }, []);
}

export function groupSchemeMultiPrompts(scheme: RecallPrompts): RecallPrompts {
  return {
    preMeals: groupMultiPrompts(scheme.preMeals),
    meals: {
      preFoods: groupMultiPrompts(scheme.meals.preFoods),
      foods: groupMultiPrompts(scheme.meals.foods),
      postFoods: groupMultiPrompts(scheme.meals.postFoods),
    },
    postMeals: groupMultiPrompts(scheme.postMeals),
    submission: groupMultiPrompts(scheme.submission),
  };
}

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
