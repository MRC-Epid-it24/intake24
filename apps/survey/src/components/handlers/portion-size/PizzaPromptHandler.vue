<template>
  <pizza-prompt
    v-bind="{
      food: food(),
      meal,
      initialState: state,
      parameters,
      parentFood,
      prompt,
      section,
    }"
    @action="action"
    @update="update"
  ></pizza-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { PizzaPrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'PizzaPromptHandler',

  components: { PizzaPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['pizza-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const {
      encodedFood: food,
      encodedFoodPortionSizeData,
      parameters,
      parentFoodOptional: parentFood,
      portionSize,
    } = useFoodPromptUtils<'pizza'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['pizza-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'pizza',
        type: { id: undefined, index: undefined, image: null },
        thickness: { id: undefined, index: undefined, image: null },
        slice: { id: undefined, index: undefined, image: null, quantity: 1 },
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      confirmed: { type: false, thickness: false, slice: false, quantity: false },
    });

    const {
      state,
      actionPortionSize: action,
      update,
    } = usePromptHandlerStore(props, ctx, getInitialState);

    return {
      food,
      meal,
      parameters,
      parentFood,
      portionSize,
      state,
      action,
      update,
    };
  },
});
</script>
