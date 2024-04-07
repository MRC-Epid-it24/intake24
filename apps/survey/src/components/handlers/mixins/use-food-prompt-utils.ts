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
import type { UserFoodData, UserPortionSizeMethod } from '@intake24/common/types/http';
import { useSurvey } from '@intake24/survey/stores';

export function useFoodPromptUtils<T extends PortionSizeMethodId>() {
  const survey = useSurvey();

  const localeId = computed(() => survey.localeId);
  const meals = computed(() => survey.meals);
  const foodIndex = computed(() => survey.selectedFoodIndex);
  const foodOptional = computed(() => survey.selectedFoodOptional);
  const parentFoodOptional = computed(() => {
    const food = survey.selectedParentFood;
    if (!food)
      return undefined;

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

  const parentEncodedFood = computed(() => {
    if (parentFoodOptional.value?.type !== 'encoded-food')
      throw new Error('This prompt requires parent encoded food to be selected');

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
    () => portionSize().parameters as unknown as PortionSizeParameters[T],
  );

  const linkedQuantityCategories = (data: UserFoodData) =>
    survey.linkedQuantity?.parent.filter(cat => data.categories.includes(cat.code)) ?? [];

  const linkedParent = computed(() => {
    const source = encodedFood().data.categories.find(cat =>
      survey.linkedQuantity?.source.includes(cat),
    );
    if (!source)
      return undefined;

    if (
      parentFoodOptional.value?.type === 'encoded-food'
      && parentFoodOptional.value.portionSize?.method === 'guide-image'
      && parentFoodOptional.value.portionSize.quantity > 1
    ) {
      return {
        food: parentFoodOptional.value,
        categories: linkedQuantityCategories(parentFoodOptional.value.data),
      };
    }

    if (parentFoodOptional.value?.type === 'recipe-builder') {
      const food = parentFoodOptional.value.linkedFoods.find(
        food =>
          food.type === 'encoded-food'
          && food.portionSize?.method === 'guide-image'
          && food.portionSize.quantity > 1,
      ) as EncodedFood | undefined;

      if (food)
        return { food, categories: linkedQuantityCategories(food.data) };
    }

    return undefined;
  });

  const initializeRecipeComponents = (steps: number[]) =>
    steps.map(step => ({ ingredients: [], order: step }));

  return {
    food,
    foodIndex,
    foodOptional,
    linkedParent,
    localeId,
    meals,
    parentEncodedFood,
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
}
