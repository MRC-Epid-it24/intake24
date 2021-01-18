import { Meal, RecallQuestions } from '..';

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
  | 'nutrientTypes'
  | 'portionSizes';

export type ExportField = {
  id: string;
  label: string;
};

export type ExportSectionInfo = {
  id: ExportSection;
  fields: ExportField[];
};

export type Scheme = {
  id: string;
  name: string;
  type: SchemeType;
  questions: RecallQuestions;
  meals: Meal[];
  export: ExportSectionInfo[];
  createdAt: Date;
  updatedAt: Date;
};
