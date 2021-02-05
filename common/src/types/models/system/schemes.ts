import { Meal, RecallQuestions } from '../..';

export enum SchemeTypes {
  DATA_DRIVEN = 'data-driven',
}

export type SchemeType = SchemeTypes;

export type ExportSection =
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

export type ExportSchemeSection = {
  id: ExportSection;
  fields: ExportField[];
};

export type ExportScheme = ExportSchemeSection[];

export type Scheme = {
  id: string;
  name: string;
  type: SchemeType;
  questions: RecallQuestions;
  meals: Meal[];
  export: ExportScheme;
  createdAt: Date;
  updatedAt: Date;
};
