<template>
  <pizza-prompt
    v-bind="{
      food: food(),
      initialState: state,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  ></pizza-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import { PizzaPrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'PizzaPromptHandler',

  components: { PizzaPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['pizza-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const {
      encodedFood: food,
      encodedFoodPortionSizeData,
      parentFoodOptional: parentFood,
      portionSize,
    } = useFoodPromptUtils<'pizza'>();

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

    const { state, update, commitPortionSize } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState
    );

    const action = (type: string, id?: string) => {
      if (type === 'next') commitPortionSize();

      emit('action', type, id);
    };

    return {
      food,
      parentFood,
      portionSize,
      state,
      action,
      update,
    };
  },
});
</script>
