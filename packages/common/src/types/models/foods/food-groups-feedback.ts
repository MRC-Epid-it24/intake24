import type { OmitAndOptional } from '..';

export type FoodGroupFeedbackAttributes = {
  id: number;
  name: string;
  tooHighThreshold: number | null;
  tooHighMessage: string | null;
  tooLowThreshold: number | null;
  tooLowMessage: string | null;
  tellMeMoreText: string;
};

export type FoodGroupFeedbackCreationAttributes = OmitAndOptional<
  FoodGroupFeedbackAttributes,
  'id',
  'tooHighThreshold' | 'tooHighMessage' | 'tooLowThreshold' | 'tooLowMessage'
>;

export type FoodGroupFeedbackNutrientAttributes = {
  foodGroupsFeedbackId: number;
  nutrientId: string;
};
