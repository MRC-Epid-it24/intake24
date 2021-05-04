import {
  Meal,
  MealSection,
  PromptQuestion,
  PromptQuestionWithSection,
  SurveyQuestionSection,
  RecallQuestions,
} from '../types';
import { ExportSection } from '../types/models';

export const flattenScheme = (scheme: RecallQuestions): PromptQuestion[] =>
  Object.values(scheme).reduce<PromptQuestion[]>((acc, questions) => {
    acc.push(...(Array.isArray(questions) ? questions : flattenScheme(questions)));
    return acc;
  }, []);

export const flattenSchemeWithSection = (scheme: RecallQuestions): PromptQuestionWithSection[] =>
  Object.entries(scheme).reduce<PromptQuestionWithSection[]>((acc, [section, questions]) => {
    const items = Array.isArray(questions)
      ? questions.map((question) => ({ ...question, section }))
      : flattenScheme(questions);

    acc.push(...items);
    return acc;
  }, []);

export const surveySections: SurveyQuestionSection[] = ['preMeals', 'postMeals', 'submission'];

export const mealSections: MealSection[] = ['preFoods', 'foods', 'postFoods'];

export const isMealSection = (section: any): section is MealSection => {
  return mealSections.includes(section);
};

export const isSurveySection = (section: any): section is SurveyQuestionSection => {
  return surveySections.includes(section);
};

export const defaultMeals: Meal[] = [
  { name: { en: 'Breakfast' }, time: '8:00' },
  { name: { en: 'Morning snack' }, time: '10:00' },
  { name: { en: 'Lunch' }, time: '13:00' },
  { name: { en: 'Afternoon snack' }, time: '16:00' },
  { name: { en: 'Dinner' }, time: '18:00' },
  { name: { en: 'Evening snack' }, time: '20:00' },
];

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
