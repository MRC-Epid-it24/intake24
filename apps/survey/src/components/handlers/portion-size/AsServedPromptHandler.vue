<template>
  <as-served-prompt
    v-bind="{
      food: food(),
      linkedQuantityCategories,
      meal,
      parentFood,
      initialState: state,
      parameters,
      prompt,
      section,
    }"
    @action="action"
    @update="update"
  ></as-served-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
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
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const {
      encodedFood: food,
      encodedFoodPortionSizeData,
      linkedQuantityCategories,
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
        linkedQuantity: 1,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      servingImageConfirmed: false,
      leftoversPrompt: undefined,
      leftoversImageConfirmed: false,
      linkedQuantityConfirmed: false,
    });

    const { state, update, commitPortionSize } = usePromptHandlerStore(props, getInitialState);

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next') commitPortionSize();

      emit('action', type, ...args);
    };

    return {
      food,
      linkedQuantityCategories,
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
