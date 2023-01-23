import type { Prompt } from '../../../prompts';
import type { ExportSection, RecallQuestions, SchemeType } from '../../../schemes';
import type { Meal } from '../..';
import type { OmitAndOptional } from '../../common';

export type SurveySchemeAttributes = {
  id: string;
  name: string;
  type: SchemeType;
  questions: RecallQuestions;
  meals: Meal[];
  dataExport: ExportSection[];
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SurveySchemeCreationAttributes = OmitAndOptional<
  SurveySchemeAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'type' | 'questions' | 'meals' | 'dataExport' | 'ownerId'
>;

export type SurveySchemeQuestionAttributes = {
  id: string;
  questionId: string;
  name: string;
  question: Prompt;
  createdAt: Date;
  updatedAt: Date;
};

export type SurveySchemeQuestionCreationAttributes = Omit<
  SurveySchemeQuestionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export const updateSurveySchemeFields = ['name', 'type', 'meals'] as const;

export type UpdateSurveySchemeField = (typeof updateSurveySchemeFields)[number];

export const perCardSurveySchemeFields = ['questions', 'dataExport'] as const;

export type PerCardSurveySchemeField = (typeof perCardSurveySchemeFields)[number];

export const createSurveySchemeFields = [
  ...updateSurveySchemeFields,
  ...perCardSurveySchemeFields,
] as const;

export type CreateSurveySchemeField = (typeof createSurveySchemeFields)[number];
