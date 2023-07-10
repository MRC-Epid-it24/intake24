<template>
  <as-served-prompt
    v-bind="{
      food: food(),
      meal,
      parentFood,
      initialState: state,
      parameters,
      prompt,
    }"
    @action="action"
    @update="update"
  ></as-served-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import { AsServedPrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'AsServedPromptHandler',

  components: { AsServedPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['as-served-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const {
      encodedFood: food,
      encodedFoodPortionSizeData,
      parameters,
      parentFoodOptional: parentFood,
      portionSize,
    } = useFoodPromptUtils<'as-served'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['as-served-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'as-served',
        serving: null,
        leftovers: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      servingImageConfirmed: false,
      leftoversPrompt: undefined,
      leftoversImageConfirmed: false,
      linkedQuantity: 1,
      linkedQuantityConfirmed: false,
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
