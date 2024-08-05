import { z } from 'zod';

import type { Meal } from './meals';
import {
  basePrompt,
  type Condition,
  CurrentPromptVersion,
  type Prompt,
  prompt,
  type SinglePrompt,
  singlePrompt,
} from '../prompts';

export const schemeTypes = ['default'] as const;
export type SchemeType = (typeof schemeTypes)[number];

export const surveySections = ['preMeals', 'postMeals', 'submission'] as const;
export type SurveyPromptSection = (typeof surveySections)[number];

export const mealSections = ['preFoods', 'foods', 'postFoods'] as const;
export type MealSection = (typeof mealSections)[number];

export const promptSections = [...surveySections, ...mealSections] as const;
export type PromptSection = (typeof promptSections)[number];

export const promptWithSection = basePrompt.extend({
  section: z.enum(promptSections),
});
export type PromptWithSection = z.infer<typeof promptWithSection>;

export function isMealSection(section: any): section is MealSection {
  return mealSections.includes(section);
}

export function isSurveySection(section: any): section is SurveyPromptSection {
  return surveySections.includes(section);
}

export type SurveySection = SurveyPromptSection | 'meals';

export const recallPrompts = z.object({
  preMeals: singlePrompt.array(),
  meals: z.object({
    preFoods: singlePrompt.array(),
    foods: singlePrompt.array(),
    postFoods: singlePrompt.array(),
  }),
  postMeals: singlePrompt.array(),
  submission: singlePrompt.array(),
});
export type RecallPrompts = z.infer<typeof recallPrompts>;

export const groupedRecallPrompts = z.object({
  preMeals: prompt.array(),
  meals: z.object({
    preFoods: prompt.array(),
    foods: prompt.array(),
    postFoods: prompt.array(),
  }),
  postMeals: prompt.array(),
  submission: prompt.array(),
});
export type GroupedRecallPrompts = z.infer<typeof groupedRecallPrompts>;

export function flattenScheme(scheme: RecallPrompts): Prompt[] {
  return Object.values(scheme).reduce<Prompt[]>((acc, prompts) => {
    // @ts-expect-error fix
    acc.push(...(Array.isArray(prompts) ? prompts : flattenScheme(prompts)));
    return acc;
  }, []);
}

export function flattenSchemeWithSection(scheme: RecallPrompts): PromptWithSection[] {
  return Object.entries(scheme).reduce<PromptWithSection[]>((acc, [section, prompts]) => {
    const items = Array.isArray(prompts)
      ? prompts.map(prompt => ({ ...prompt, section }))
      // @ts-expect-error fix
      : flattenSchemeWithSection(prompts);

    // @ts-expect-error fix
    acc.push(...items);
    return acc;
  }, []);
}

export function groupMultiPrompts(prompts: SinglePrompt[]) {
  const grouped = prompts.reduce<
    Record<string, { idx: number; prompts: SinglePrompt[]; conditions: Condition[]; inserted: boolean }>
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
        version: CurrentPromptVersion,
        i18n: {},
        conditions: grouped[item.group].conditions,
        useGraph: false,
      });
      grouped[item.group].inserted = true;
    }
    return acc;
  }, []);
}

export function groupSchemeMultiPrompts(scheme: RecallPrompts): GroupedRecallPrompts {
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

export const exportSectionIds = [
  'user',
  'userCustom',
  'survey',
  'submission',
  'submissionCustom',
  'meal',
  'mealCustom',
  'food',
  'foodCustom',
  'foodNutrients',
  'foodFields',
  'portionSizes',
] as const;
export type ExportSectionId = (typeof exportSectionIds)[number];

export const exportField = z.object({
  id: z.string(),
  label: z.string(),
});
export type ExportField = z.infer<typeof exportField>;

export const exportSection = z.object({
  id: z.enum(exportSectionIds),
  fields: exportField.array(),
});
export type ExportSection = z.infer<typeof exportSection>;

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
