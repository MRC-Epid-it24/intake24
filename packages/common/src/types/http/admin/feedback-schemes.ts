import type {
  FeedbackSchemeAttributes,
  Pagination,
  PhysicalActivityLevelAttributes,
  UserSecurable,
} from '@intake24/db';

import type { NutrientTypeEntry } from './nutrient-types';
import type { Owner } from './users';

/* export type FeedbackSchemeRequest = FeedbackSchemeCreationAttributes;

export type CreateFeedbackSchemeRequest = FeedbackSchemeRequest;

export type UpdateFeedbackSchemeRequest = Omit<FeedbackSchemeRequest, 'id'>; */

export type FeedbackSchemesResponse = Pagination<FeedbackSchemeAttributes>;

export type FeedbackSchemeRefEntry = FeedbackSchemeAttributes;

export interface FeedbackSchemeEntry extends FeedbackSchemeAttributes {
  owner?: Owner;
  securables?: UserSecurable[];
}

export type FeedbackSchemeListEntry = Pick<FeedbackSchemeAttributes, 'id' | 'name'>;

export type FeedbackSchemeRefs = {
  nutrientTypes: NutrientTypeEntry[];
  physicalActivityLevels: PhysicalActivityLevelAttributes[];
};
