import {
  FeedbackSchemeAttributes,
  // FeedbackSchemeCreationAttributes,
} from '../../models/system/feedback-schemes';
import { NutrientTypeAttributes, Pagination } from '../../models';

/* export type FeedbackSchemeRequest = FeedbackSchemeCreationAttributes;

export type CreateFeedbackSchemeRequest = FeedbackSchemeRequest;

export type UpdateFeedbackSchemeRequest = Omit<FeedbackSchemeRequest, 'id'>; */

export type FeedbackSchemesResponse = Pagination<FeedbackSchemeAttributes>;

export type FeedbackSchemeEntry = FeedbackSchemeAttributes;

export type FeedbackSchemeListEntry = Pick<FeedbackSchemeAttributes, 'id' | 'name'>;

export type FeedbackSchemeRefs = {
  nutrients: NutrientTypeAttributes[];
};
