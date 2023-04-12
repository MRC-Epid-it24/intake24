import { computed } from 'vue';

import type {
  EncodedFood,
  FoodState,
  FreeTextFood,
  LocaleTranslation,
  MissingFood,
  PortionSizeMethodId,
  PortionSizeParameters,
  PortionSizeStates,
} from '@intake24/common/types';
import type { UserPortionSizeMethod } from '@intake24/common/types/http';
import { useSurvey } from '@intake24/survey/stores';

export const useFoodPromptUtils = <T extends PortionSizeMethodId>() => {
  const survey = useSurvey();

  const localeId = computed(() => survey.localeId);
  const meals = computed(() => survey.meals);
  const foodIndex = computed(() => survey.selectedFoodIndex);
  const foodOptional = computed(() => survey.selectedFoodOptional);
  const parentFoodOptional = computed(() => {
    const food = survey.selectedParentFood;
    if (!food) return undefined;

    if (food.type !== 'encoded-food') throw new Error('This selected food must be an encoded food');

    return food;
  });
  const parentFood = computed(() => {
    if (parentFoodOptional.value === undefined)
      throw new Error('This prompt requires parent food to be selected');

    return parentFoodOptional.value;
  });

  const food = (): FoodState => {
    if (foodOptional.value === undefined)
      throw new Error('This prompt requires a food to be selected');

    return foodOptional.value;
  };

  const encodedFood = (): EncodedFood => {
    const foodEntry = food();

    if (foodEntry.type !== 'encoded-food')
      throw new Error('This selected food must be an encoded food');

    return foodEntry;
  };

  // TODO: should improve EncodedFood type to avoid this type assertion
  const encodedFoodPortionSizeData = (): PortionSizeStates[T] | null => {
    const foodEntry = encodedFood();

    return foodEntry.portionSize as PortionSizeStates[T] | null;
  };

  const encodedFoodOptional = (): EncodedFood | undefined => {
    if (foodOptional.value === undefined || foodOptional.value.type !== 'encoded-food')
      return undefined;

    return encodedFood();
  };

  const freeTextFood = (): FreeTextFood => {
    const foodEntry = food();

    if (foodEntry.type !== 'free-text')
      throw new Error('This selected food must be an free-text food');

    return foodEntry;
  };

  const missingFood = (): MissingFood => {
    const foodEntry = food();

    if (foodEntry.type !== 'missing-food')
      throw new Error('This selected food must be an missing food');

    return foodEntry;
  };

  const foodName = (): LocaleTranslation => ({ en: encodedFood().data.localName });

  const portionSize = (): UserPortionSizeMethod => {
    const selectedFood = encodedFood();

    if (selectedFood.portionSizeMethodIndex === null)
      throw new Error('This prompt requires a portion size option to be selected');

    return selectedFood.data.portionSizeMethods[selectedFood.portionSizeMethodIndex];
  };

  const conversionFactor = computed(() => portionSize().conversionFactor);

  const parameters = computed(
    () => portionSize().parameters as unknown as PortionSizeParameters[T]
  );

  return {
    localeId,
    food,
    foodIndex,
    foodOptional,
    meals,
    parentFood,
    parentFoodOptional,
    encodedFood,
    encodedFoodPortionSizeData,
    encodedFoodOptional,
    freeTextFood,
    foodName,
    missingFood,
    portionSize,
    conversionFactor,
    parameters,
  };
};
