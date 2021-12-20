import {
  Pagination,
  SchemeQuestionAttributes,
  SchemeQuestionCreationAttributes,
} from '../../models';
import { LanguageListEntry } from './languages';
import { SchemeEntry } from './schemes';

export type SchemeQuestionRequest = SchemeQuestionCreationAttributes;

export type CreateSchemeQuestionRequest = SchemeQuestionRequest;

export type UpdateSchemeQuestionRequest = Omit<SchemeQuestionRequest, 'id'>;

export type SchemeQuestionsResponse = Pagination<SchemeQuestionAttributes>;

export type SchemeQuestionEntry = SchemeQuestionAttributes;

export type SchemeQuestionRefs = {
  languages: LanguageListEntry[];
  schemes: SchemeEntry[];
  questionIds: string[];
};
