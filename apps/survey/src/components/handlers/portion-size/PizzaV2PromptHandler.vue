<template>
  <pizza-v2-prompt
    v-model="state"
    v-bind="{
      conversionFactor,
      food: food(),
      meal,
      parameters,
      parentFood,
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
import { PizzaV2Prompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'PizzaV2PromptHandler',

  components: { PizzaV2Prompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['pizza-v2-prompt']>,
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
      parentFoodOptional: parentFood,
      portionSizeMethods,
    } = useFoodPromptUtils<'pizza-v2'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['pizza-v2-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'pizza-v2',
        size: null,
        crust: null,
        unit: null,
        quantity: 1,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: food().portionSizeMethodIndex !== null ? 1 : 0,
      confirmed: { size: false, crust: false, unit: false, quantity: false },
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
      parentFood,
      portionSizeMethods,
      state,
      action,
      update,
    };
  },
});
</script>
