<template>
  <standard-portion-prompt
    v-bind="{
      conversionFactor,
      food: food(),
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

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

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
      parameters,
      parentFoodOptional: parentFood,
    } = useFoodPromptUtils<'standard-portion'>();

    const getInitialState = (): PromptStates['standard-portion-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'standard-portion',
        unit: null,
        quantity: 1,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      quantityConfirmed: false,
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
      conversionFactor,
      food,
      parameters,
      parentFood,
      state,
      action,
      update,
    };
  },
});
</script>
