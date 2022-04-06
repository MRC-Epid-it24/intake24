import type {
  DemographicGroup,
  FeedbackType,
  Card,
  HenryCoefficient,
  TopFoods,
} from '../../../feedback';
import type { OmitAndOptional } from '../model';

export type FeedbackSchemeAttributes = {
  id: string;
  name: string;
  type: FeedbackType;
  topFoods: TopFoods;
  cards: Card[];
  demographicGroups: DemographicGroup[];
  henryCoefficients: HenryCoefficient[];
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type FeedbackSchemeCreationAttributes = OmitAndOptional<
  FeedbackSchemeAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'ownerId'
>;

export const updateFeedbackSchemeFields = [
  'name',
  'type',
  'topFoods',
  'cards',
  'demographicGroups',
  'henryCoefficients',
] as const;

export const editFeedbackSchemeFields = ['name', 'type'] as const;

export const perCardFeedbackSchemeFields = [
  'topFoods',
  'cards',
  'demographicGroups',
  'henryCoefficients',
] as const;
