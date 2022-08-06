import type { Pagination } from '../../models';
import type { PhysicalActivityLevelAttributes } from '../../models/foods/physical-activity-levels';
import type {
  FeedbackSchemeAttributes,
  // FeedbackSchemeCreationAttributes,
} from '../../models/system/feedback-schemes';
import type { LanguageListEntry } from './languages';
import type { NutrientTypeEntry } from './nutrient-types';

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
