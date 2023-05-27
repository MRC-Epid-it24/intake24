import type { LocaleTranslation, RequiredLocaleTranslation } from '@intake24/common/types';
import type { NutrientType } from '@intake24/common/types/http';

export const getLocaleContent = (
  content: RequiredLocaleTranslation | LocaleTranslation,
  locale: string
): string => content[locale] ?? content.en;

export const getNutrientGroupUnit = (group: string[], nutrientTypes: NutrientType[]): string => {
  const nt = nutrientTypes.filter((item) => group.includes(item.id));
  if (nt.length !== group.length)
    throw new Error(`Invalid nutrient types (${group}) defined in feedback top foods.`);

  if (nt.some((item) => item.unit !== nt[0].unit))
    throw new Error('All nutrient types must have the same unit.');

  return nt[0].unit;
};
