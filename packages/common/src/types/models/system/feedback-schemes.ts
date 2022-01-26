import { FeedbackType, FoodGroup, HenryCoefficient, TopFoods } from '../../../feedback';

export type FeedbackSchemeAttributes = {
  id: string;
  name: string;
  type: FeedbackType;
  topFoods: TopFoods;
  foodGroups: FoodGroup[];
  henryCoefficients: HenryCoefficient[];
  createdAt: Date;
  updatedAt: Date;
};

export type FeedbackSchemeCreationAttributes = Omit<
  FeedbackSchemeAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
