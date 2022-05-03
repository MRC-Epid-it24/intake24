import type {
  DemographicGroup,
  FeedbackOutput,
  FeedbackPhysicalDataField,
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
  outputs: FeedbackOutput[];
  physicalDataFields: FeedbackPhysicalDataField[];
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
  'outputs',
  'physicalDataFields',
  'topFoods',
  'cards',
  'demographicGroups',
  'henryCoefficients',
] as const;

export const editFeedbackSchemeFields = ['name', 'type', 'outputs', 'physicalDataFields'] as const;

export const perCardFeedbackSchemeFields = [
  'topFoods',
  'cards',
  'demographicGroups',
  'henryCoefficients',
] as const;
