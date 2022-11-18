<template>
  <ready-meal-prompt
    v-bind="{ initialState: state, meal, promptComponent, promptProps }"
    @action="action"
    @update="update"
  ></ready-meal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ReadyMealPromptProps, StandardComponentType } from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/types';
import type { ReadyMealPromptState } from '@intake24/survey/components/prompts/standard';
import { ReadyMealPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useMealPromptUtils, usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'ReadyMealPromptHandler',

  components: { ReadyMealPrompt },

  props: {
    promptComponent: {
      type: String as PropType<StandardComponentType>,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<ReadyMealPromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const { meal } = useMealPromptUtils();
    const survey = useSurvey();

    const getInitialState = (): ReadyMealPromptState => ({
      foods: (
        meal.value.foods.filter(
          (food) => food.type === 'encoded-food' && food.data.readyMealOption
        ) as EncodedFood[]
      ).map((food) => ({ id: food.id, name: food.data.localName, value: false })),
    });

    const { state, update } = usePromptHandlerNoStore(getInitialState, context);

    const commitAnswer = () => {
      for (const food of state.value.foods) {
        if (!food.value) continue;

        survey.setFoodFlag({ foodId: food.id, flag: 'ready-meal' });
      }

      survey.setMealFlag({ mealId: meal.value.id, flag: 'ready-meal-complete' });
    };

    const action = (type: string, id?: number) => {
      if (type === 'next') commitAnswer();

      context.emit('action', type, id);
    };

    if (!state.value.foods.length) action('next');

    return { meal, state, update, action };
  },
});
</script>

<style scoped></style>
