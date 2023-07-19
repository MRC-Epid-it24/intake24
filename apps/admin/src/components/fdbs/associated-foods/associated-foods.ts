import type { AssociatedFoodCreationAttributes } from '@intake24/db';

export type AssociatedFoodItem = AssociatedFoodCreationAttributes;

export const createDefaultAssociatedFood = (
  foodCode: string,
  localeId: string
): Omit<AssociatedFoodItem, 'id'> => ({
  foodCode,
  localeId,
  genericName: { en: '' },
  text: { en: '' },
  linkAsMain: false,
  multiple: false,
  orderBy: '0',
});
