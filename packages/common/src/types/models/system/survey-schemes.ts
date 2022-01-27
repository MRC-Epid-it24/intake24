import type { PromptQuestion } from '../../../prompts';
import type { RecallQuestions, SchemeType } from '../../../schemes';
import type { Meal } from '../..';

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

export type SurveySchemeAttributes = {
  id: string;
  name: string;
  type: SchemeType;
  questions: RecallQuestions;
  meals: Meal[];
  dataExport: ExportSection[];
  createdAt: Date;
  updatedAt: Date;
};

export type SurveySchemeCreationAttributes = Omit<
  SurveySchemeAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export type SurveySchemeQuestionAttributes = {
  id: string;
  questionId: string;
  name: string;
  question: PromptQuestion;
  createdAt: Date;
  updatedAt: Date;
};

export type SurveySchemeQuestionCreationAttributes = Omit<
  SurveySchemeQuestionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
