import { computed } from 'vue';

import type {
  EncodedFood,
  FoodState,
  LocaleTranslation,
  PortionSizeMethodId,
  PortionSizeParameters,
} from '@intake24/common/types';
import type { UserPortionSizeMethod } from '@intake24/common/types/http';
import { useSurvey } from '@intake24/survey/stores';

export const useFoodPromptUtils = <T extends PortionSizeMethodId>() => {
  const survey = useSurvey();

  const localeId = computed(() => survey.localeId);
  const selectedFoodOptional = computed(() => survey.selectedFoodOptional);

  const selectedFood = (): FoodState => {
    if (selectedFoodOptional.value === undefined)
      throw new Error('This prompt requires a food to be selected');

    return selectedFoodOptional.value;
  };

  const encodedSelectedFood = (): EncodedFood => {
    const food = selectedFood();

    if (food?.type !== 'encoded-food')
      throw new Error('This selected food must be an encoded food');

    return food;
  };

  const foodName = (): LocaleTranslation => {
    return {
      en: encodedSelectedFood().data.englishName,
    };
  };

  const selectedPortionSize = (): UserPortionSizeMethod => {
    const selectedFood = encodedSelectedFood();

    if (selectedFood.portionSizeMethodIndex === null)
      throw new Error('This prompt requires a portion size option to be selected');

    return selectedFood.data.portionSizeMethods[selectedFood.portionSizeMethodIndex];
  };

  const conversionFactor = computed(() => selectedPortionSize().conversionFactor);

  const parameters = computed(
    () => selectedPortionSize().parameters as unknown as PortionSizeParameters[T]
  );

  return {
    localeId,
    selectedFoodOptional,
    selectedFood,
    encodedSelectedFood,
    foodName,
    selectedPortionSize,
    conversionFactor,
    parameters,
  };
};
