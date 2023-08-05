<template>
  <standard-portion-prompt
    v-bind="{
      conversionFactor,
      food: food(),
      linkedQuantityCategories,
      meal,
      initialState: state,
      parameters,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  >
  </standard-portion-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import { StandardPortionPrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'StandardPortionPromptHandler',

  components: { StandardPortionPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['standard-portion-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const {
      conversionFactor,
      encodedFood: food,
      encodedFoodPortionSizeData,
      linkedQuantityCategories,
      parameters,
      parentFoodOptional: parentFood,
    } = useFoodPromptUtils<'standard-portion'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['standard-portion-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'standard-portion',
        unit: null,
        quantity: 1,
        linkedQuantity: 1,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      quantityConfirmed: false,
      linkedQuantityConfirmed: false,
    });

    const { state, update, commitPortionSize } = usePromptHandlerStore(props, getInitialState);

    const action = (type: string, id?: string) => {
      if (type === 'next') commitPortionSize();

      emit('action', type, id);
    };

    return {
      conversionFactor,
      food,
      linkedQuantityCategories,
      meal,
      parameters,
      parentFood,
      state,
      action,
      update,
    };
  },
});
</script>
