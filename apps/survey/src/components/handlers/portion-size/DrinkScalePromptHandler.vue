<template>
  <drink-scale-prompt
    v-bind="{
      food: food(),
      initialState: state,
      parameters,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  >
  </drink-scale-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import { DrinkScalePrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'DrinkScalePromptHandler',

  components: { DrinkScalePrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['drink-scale-prompt']>,
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
    } = useFoodPromptUtils<'drink-scale'>();

    const getInitialState = (): PromptStates['drink-scale-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'drink-scale',
        drinkwareId: '',
        initialFillLevel: 0.9,
        skipFillLevel: false,
        imageUrl: '',
        containerId: undefined,
        containerIndex: undefined,
        fillLevel: 0,
        servingWeight: 0,
        leftoversLevel: 0,
        leftoversWeight: 0,
        leftovers: false,
      },
      panel: 0,
      objectConfirmed: false,
      quantityConfirmed: false,
      leftoversConfirmed: false,
      leftoversPrompt: undefined,
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
      parameters,
      parentFood,
      state,
      action,
      update,
    };
  },
});
</script>
