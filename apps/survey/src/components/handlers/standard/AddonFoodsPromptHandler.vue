<template>
  <addon-foods-prompt
    v-model="state"
    v-bind="{
      food,
      meal,
      meals,
      localeId,
      prompt,
      section,
    }"
    @action="action"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { PromptStates } from '@intake24/common/prompts';
import type { FoodState, PortionSizeParameters } from '@intake24/common/surveys';
import { AddonFoodsPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';
import { addonFoodPromptCheck, getEntityId } from '@intake24/survey/util';
import { createHandlerProps, useFoodPromptUtils, useMealPromptUtils, usePromptHandlerNoStore } from '../composables';

const props = defineProps(createHandlerProps<'addon-foods-prompt'>());

const emit = defineEmits(['action']);

const { encodedFoodOptional: food, localeId } = useFoodPromptUtils();
const { mealOptional: meal } = useMealPromptUtils();
const survey = useSurvey();

const meals = computed(() => {
  if (meal.value) {
    // Food-level prompt
    const foodEntry = food.value;
    if (foodEntry?.id) {
      return [{
        ...meal.value,
        foods: [foodEntry].filter(addonFoodPromptCheck(props.prompt)),
      }].filter(meal => meal.foods.length);
    }

    // Meal-level prompt
    return [{
      ...meal.value,
      foods: meal.value.foods.filter(addonFoodPromptCheck(props.prompt)),
    }].filter(meal => meal.foods.length);
  }

  // Survey-level prompt
  return survey.meals.map(meal => ({
    ...meal,
    foods: meal.foods.filter(addonFoodPromptCheck(props.prompt)),
  })).filter(meal => meal.foods.length);
});

const getInitialState = computed(() => ({
  foods: meals.value.reduce<PromptStates['addon-foods-prompt']['foods']>((acc, meal) => {
    meal.foods.forEach((food) => {
      acc[food.id] = [{
        confirmed: null,
        data: null,
        portionSize: {
          method: 'standard-portion',
          unit: null,
          quantity: 0,
          linkedQuantity: 1,
          servingWeight: 0,
          leftoversWeight: 0,
        },
      }];
    });
    return acc;
  }, {}),
}));

const { state } = usePromptHandlerNoStore({ emit }, getInitialState);

function commitAnswer() {
  const searchTerm = `addon-foods-prompt:${props.prompt.lookup.type}:${props.prompt.lookup.value}`;

  for (const [foodId, addons] of Object.entries(state.value.foods)) {
    const linkedFoods = addons.reduce<FoodState[]>((acc, addon) => {
      const { confirmed, data, portionSize } = addon;
      if (confirmed === undefined) {
        console.warn('AddonFoodsPromptHandler: not confirmed or no food data!');
        return acc;
      }

      if (confirmed === false || !data)
        return acc;

      const portionSizeMethodIndex = data.portionSizeMethods.findIndex(psm =>
        psm.method === portionSize.method
        && (psm.parameters as PortionSizeParameters['standard-portion']).units.find(unit => unit.name === portionSize.unit?.name));

      acc.push(
        {
          type: 'encoded-food',
          id: getEntityId(),
          flags: ['portion-size-option-complete', 'portion-size-method-complete'],
          linkedFoods: [],
          customPromptAnswers: {},
          data,
          searchTerm,
          portionSizeMethodIndex,
          portionSize,
        },
      );
      return acc;
    }, []);

    survey.addLinkedFoods(foodId, linkedFoods);
  }

  const foodEntry = food.value;
  if (foodEntry?.id) {
    survey.addFoodFlag(foodEntry.id, `${props.prompt.id}-complete`);
  }
  else if (meal.value) {
    survey.addMealFlag(meal.value.id, `${props.prompt.id}-complete`);
  }
  else {
    survey.addFlag(`${props.prompt.id}-complete`);
  }
}

function action(type: string, ...args: [id?: string, params?: object]) {
  if (type === 'next')
    commitAnswer();

  emit('action', type, ...args);
}
</script>
