import {
  DemographicGroup,
  FeedbackType,
  Card,
  HenryCoefficient,
  TopFoods,
} from '../../../feedback';

export type FeedbackSchemeAttributes = {
  id: string;
  name: string;
  type: FeedbackType;
  topFoods: TopFoods;
  cards: Card[];
  demographicGroups: DemographicGroup[];
  henryCoefficients: HenryCoefficient[];
  createdAt: Date;
  updatedAt: Date;
};

export type FeedbackSchemeCreationAttributes = Omit<
  FeedbackSchemeAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
