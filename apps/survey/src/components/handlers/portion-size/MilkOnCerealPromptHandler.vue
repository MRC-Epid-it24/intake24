<template>
  <milk-on-cereal-prompt
    v-bind="{
      food: food(),
      meal,
      initialState: state,
      parameters,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  ></milk-on-cereal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import { MilkOnCerealPrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'MilkOnCerealPromptHandler',

  components: { MilkOnCerealPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['milk-on-cereal-prompt']>,
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
    } = useFoodPromptUtils<'milk-on-cereal'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['milk-on-cereal-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'milk-on-cereal',
        imageUrl: null,
        bowl: null,
        bowlId: undefined,
        bowlIndex: undefined,
        milkLevelId: undefined,
        milkLevelIndex: undefined,
        milkLevelImage: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      bowlConfirmed: false,
      milkLevelConfirmed: false,
    });

    const { state, update, commitPortionSize } = usePromptHandlerStore(props, getInitialState);

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
