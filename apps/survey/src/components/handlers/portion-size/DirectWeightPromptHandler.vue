<template>
  <direct-weight-prompt
    v-model="state"
    v-bind="{
      conversionFactor,
      food: food(),
      meal,
      parameters,
      portionSizeMethods,
      prompt,
      section,
    }"
    @action="action"
    @update:model-value="update"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { DirectWeightPrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'DirectWeightPromptHandler',

  components: { DirectWeightPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['direct-weight-prompt']>,
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
      parameters,
      portionSizeMethods,
    } = useFoodPromptUtils<'direct-weight'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['direct-weight-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'direct-weight',
        quantity: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: food().portionSizeMethodIndex !== null ? 1 : 0,
    });

    const {
      state,
      actionPortionSize: action,
      update,
    } = usePromptHandlerStore(props, ctx, getInitialState);

    return {
      conversionFactor,
      food,
      meal,
      parameters,
      portionSizeMethods,
      state,
      action,
      update,
    };
  },
});
</script>
