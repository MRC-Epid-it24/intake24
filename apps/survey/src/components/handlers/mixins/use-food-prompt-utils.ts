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
  RecipeBuilder,
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

    if (food.type !== 'encoded-food' && food.type !== 'recipe-builder') {
      console.log(food);
      throw new Error('This selected food must be an encoded food or recipe builder');
    }

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

    if (foodEntry.type !== 'encoded-food') {
      console.log(foodEntry);
      throw new Error('This selected food must be an encoded food');
    }

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

  const recipeBuilder = (): RecipeBuilder => {
    const foodEntry = food();

    if (foodEntry.type !== 'recipe-builder')
      throw new Error('This selected food must be an Recipe Builder food');

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

  const linkedQuantityCategories = computed(() => {
    if (parentFoodOptional.value === undefined) return [];

    const { data, portionSize } = parentFoodOptional.value;
    if (!portionSize || portionSize.method !== 'guide-image' || portionSize.quantity <= 1)
      return [];

    return survey.linkedQuantityCategories.filter((cat) => data.categories.includes(cat.code));
  });

  const initializeRecipeComponents = (steps: number[]) => {
    return steps.map((step) => ({
      ingredients: [],
      order: step,
    }));
  };

  return {
    food,
    foodIndex,
    foodOptional,
    linkedQuantityCategories,
    localeId,
    meals,
    parentFood,
    parentFoodOptional,
    encodedFood,
    encodedFoodPortionSizeData,
    encodedFoodOptional,
    freeTextFood,
    foodName,
    initializeRecipeComponents,
    missingFood,
    portionSize,
    recipeBuilder,
    conversionFactor,
    parameters,
  };
};
