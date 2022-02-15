import { PhysicalActivityLevelAttributes } from '../../models/foods/physical-activity-levels';
import {
  FeedbackSchemeAttributes,
  // FeedbackSchemeCreationAttributes,
} from '../../models/system/feedback-schemes';
import { Pagination } from '../../models';
import { LanguageListEntry } from './languages';
import { NutrientTypeEntry } from './nutrient-types';

/* export type FeedbackSchemeRequest = FeedbackSchemeCreationAttributes;

export type CreateFeedbackSchemeRequest = FeedbackSchemeRequest;

export type UpdateFeedbackSchemeRequest = Omit<FeedbackSchemeRequest, 'id'>; */

export type FeedbackSchemesResponse = Pagination<FeedbackSchemeAttributes>;

export type FeedbackSchemeEntry = FeedbackSchemeAttributes;

export type FeedbackSchemeListEntry = Pick<FeedbackSchemeAttributes, 'id' | 'name'>;

export type FeedbackSchemeRefs = {
  languages: LanguageListEntry[];
  nutrientTypes: NutrientTypeEntry[];
  physicalActivityLevels: PhysicalActivityLevelAttributes[];
};
