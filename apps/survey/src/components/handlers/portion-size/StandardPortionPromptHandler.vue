<template>
  <standard-portion-prompt
    v-model="state"
    v-bind="{
      conversionFactor,
      food: food(),
      linkedParent,
      meal,
      parameters,
      parentFood,
      prompt,
      section,
    }"
    @action="action"
    @input="update"
  >
  </standard-portion-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
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
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const {
      conversionFactor,
      encodedFood: food,
      encodedFoodPortionSizeData,
      linkedParent,
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

    const {
      state,
      actionPortionSize: action,
      update,
    } = usePromptHandlerStore(props, ctx, getInitialState);

    return {
      conversionFactor,
      food,
      linkedParent,
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
