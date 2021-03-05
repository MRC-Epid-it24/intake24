import { Meal, RecallQuestions } from '../..';

export enum SchemeTypes {
  DATA_DRIVEN = 'data-driven',
}

export type SchemeType = SchemeTypes;

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

export type Scheme = {
  id: string;
  name: string;
  type: SchemeType;
  questions: RecallQuestions;
  meals: Meal[];
  export: ExportSection[];
  createdAt: Date;
  updatedAt: Date;
};

export type SchemeCreateAttributes = Omit<Scheme, 'createdAt' | 'updatedAt'>;
