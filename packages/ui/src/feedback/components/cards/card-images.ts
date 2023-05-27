import type { CardType } from '@intake24/common/feedback';
import type { CharacterParameters, NutrientGroupParameters } from '@intake24/ui/feedback';
import { characterImageMap, fiveADayImageMap, nutrientGroupImageMap } from '@intake24/ui/feedback';

export const characterBackgroundImage = (parameters: CharacterParameters): string =>
  characterImageMap[parameters.characterType];

export const fiveADayBackgroundImage = (): string => fiveADayImageMap.fruit_veg;

export const nutrientGroupBackgroundImage = (parameters: NutrientGroupParameters): string => {
  for (const nutrientTypeId of parameters.nutrientTypes) {
    if (nutrientTypeId in nutrientGroupImageMap) return nutrientGroupImageMap[nutrientTypeId];
  }

  return '';
};

export const getBackgroundImage: Record<CardType, (...args: any[]) => any> = {
  character: characterBackgroundImage,
  'five-a-day': fiveADayBackgroundImage,
  'nutrient-group': nutrientGroupBackgroundImage,
};
