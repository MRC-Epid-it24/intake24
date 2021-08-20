import type { PromptQuestion } from '../../../prompts';
import type { RecallQuestions } from '../../../schemes';
import type { Meal } from '../..';

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

export type SchemeAttributes = {
  id: string;
  name: string;
  type: SchemeType;
  questions: RecallQuestions;
  meals: Meal[];
  export: ExportSection[];
  createdAt: Date;
  updatedAt: Date;
};

export type SchemeCreationAttributes = Omit<SchemeAttributes, 'createdAt' | 'updatedAt'>;

export type SchemeQuestionAttributes = {
  id: string;
  questionId: string;
  name: string;
  question: PromptQuestion;
  createdAt: Date;
  updatedAt: Date;
};

export type SchemeQuestionCreationAttributes = Omit<
  SchemeQuestionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
