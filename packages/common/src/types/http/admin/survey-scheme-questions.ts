import type {
  Pagination,
  SurveySchemeQuestionAttributes,
  SurveySchemeQuestionCreationAttributes,
} from '../../models';
import type { LanguageListEntry } from './languages';
import type { SurveySchemeRefEntry } from './survey-schemes';

export type SurveySchemeQuestionRequest = SurveySchemeQuestionCreationAttributes;

export type CreateSurveySchemeQuestionRequest = SurveySchemeQuestionRequest;

export type UpdateSurveySchemeQuestionRequest = Omit<SurveySchemeQuestionRequest, 'id'>;

export type SurveySchemeQuestionsResponse = Pagination<SurveySchemeQuestionAttributes>;

export type SurveySchemeQuestionEntry = SurveySchemeQuestionAttributes;

export type SurveySchemeQuestionRefs = {
  languages: LanguageListEntry[];
  schemes: SurveySchemeRefEntry[];
  questionIds: string[];
};
