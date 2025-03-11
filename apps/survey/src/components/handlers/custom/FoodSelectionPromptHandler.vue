<template>
  <food-selection-prompt
    v-model="state"
    v-bind="{ filteredFoods, meal, prompt, section }"
    @action="action"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { dynamicFoodFlag } from '@intake24/common/surveys';
import type { FoodState, PromptSection } from '@intake24/common/surveys';

import FoodSelectionPrompt from '@intake24/survey/components/prompts/custom/food-selection/food-selection-prompt.vue';

import { useSurvey } from '@intake24/survey/stores';
import { flagPromptCompletionFlag } from '@intake24/survey/util';
import { filterFoodsForFoodSelectionPrompt, foodSelectionNoneUuid } from '../../prompts/custom/food-selection/food-selection';
import { useMealPromptUtils, usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'FoodSelectionPromptHandler',

  components: { FoodSelectionPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['food-selection-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const surveyStore = useSurvey();
    const { meal } = useMealPromptUtils();

    const parsedFlag = computed(() => {
      try {
        return dynamicFoodFlag.parse(props.prompt.flag);
      }
      catch (e: any) {
        console.warn(`Invalid food flag in ${props.prompt.component} (${props.prompt.id}): "${props.prompt.flag}" (${e.message})`);
        return undefined;
      }
    });

    const relevantFoods = computed(() => filterFoodsForFoodSelectionPrompt(surveyStore, meal.value, props.prompt));

    const isFoodSelected = (food: FoodState): boolean => {
      if (props.prompt.useFlag) {
        return parsedFlag.value ? food.flags.includes(parsedFlag.value) : false;
      }
      else {
        return food.customPromptAnswers[props.prompt.id] !== undefined;
      }
    };

    const getInitialState = computed(() => meal.value.foods.filter(food => isFoodSelected(food)).map(food => food.id));

    // TODO: use store for intermediate state
    const { state } = usePromptHandlerNoStore(ctx, getInitialState);

    const commitAnswer = () => {
      function commitAnswers(food: FoodState) {
        const selected = state.value.includes(food.id) && !state.value.includes(foodSelectionNoneUuid);

        if (props.prompt.useFlag && props.prompt.flag) {
          surveyStore.addFoodFlag(food.id, flagPromptCompletionFlag(props.prompt.flag));

          if (parsedFlag.value !== undefined)
            surveyStore.setFoodFlag(food.id, parsedFlag.value, selected);
        }
        else {
          surveyStore.setFoodCustomPromptAnswer({ foodId: food.id, promptId: props.prompt.id, answer: selected });
        }
      }

      for (const food of meal.value.foods) {
        commitAnswers(food);
      }

      surveyStore.addMealFlag(meal.value.id, `${props.prompt.id}-complete`);
    };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next') {
        commitAnswer();
        ctx.emit('action', type);
        return;
      }
      ctx.emit('action', type, ...args);
    };

    return { state, action, filteredFoods: relevantFoods, meal };
  },
});
</script>

<style scoped></style>
