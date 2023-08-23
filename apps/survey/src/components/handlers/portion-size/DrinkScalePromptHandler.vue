<template>
  <drink-scale-prompt
    v-model="state"
    v-bind="{
      food: food(),
      meal,
      parameters,
      parentFood,
      prompt,
      section,
    }"
    @action="action"
    @input="update"
  >
  </drink-scale-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { DrinkScalePrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'DrinkScalePromptHandler',

  components: { DrinkScalePrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['drink-scale-prompt']>,
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
        count: 1,
      },
      panel: 0,
      objectConfirmed: false,
      quantityConfirmed: false,
      leftoversConfirmed: false,
      leftoversPrompt: undefined,
      countConfirmed: false,
    });

    const {
      state,
      actionPortionSize: action,
      update,
    } = usePromptHandlerStore(props, ctx, getInitialState);
    const { meal } = useMealPromptUtils();

    return {
      food,
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
