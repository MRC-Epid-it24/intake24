import {
  Pagination,
  SchemeQuestionAttributes,
  SchemeQuestionCreationAttributes,
} from '../../models';
import { LanguageEntry } from './languages';
import { SchemeEntry } from './schemes';

export type SchemeQuestionRequest = SchemeQuestionCreationAttributes;

export type CreateSchemeQuestionRequest = SchemeQuestionRequest;

export type UpdateSchemeQuestionRequest = Omit<SchemeQuestionRequest, 'id'>;

export type SchemeQuestionsResponse = Pagination<SchemeQuestionAttributes>;

export type SchemeQuestionEntry = SchemeQuestionAttributes;

export type SchemeQuestionRefs = {
  languages: LanguageEntry[];
  schemes: SchemeEntry[];
};

export type SchemeQuestionResponse = {
  data: SchemeQuestionEntry;
  refs: SchemeQuestionRefs;
};

export type CreateSchemeQuestionResponse = Pick<SchemeQuestionResponse, 'refs'>;

export type StoreSchemeQuestionResponse = Pick<SchemeQuestionResponse, 'data'>;
