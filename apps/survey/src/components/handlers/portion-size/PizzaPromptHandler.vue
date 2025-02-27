<template>
  <pizza-prompt
    v-model="state"
    v-bind="{
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
import { PizzaPrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'PizzaPromptHandler',

  components: { PizzaPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['pizza-prompt']>,
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
      portionSizeMethods,
    } = useFoodPromptUtils<'pizza'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['pizza-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'pizza',
        type: { id: undefined, index: undefined, image: null },
        thickness: { id: undefined, index: undefined, image: null },
        slice: { id: undefined, index: undefined, image: null, quantity: 1 },
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: food().portionSizeMethodIndex !== null ? 1 : 0,
      confirmed: { type: false, thickness: false, slice: false, quantity: false },
    });

    const {
      state,
      actionPortionSize: action,
      update,
    } = usePromptHandlerStore(props, ctx, getInitialState);

    return {
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
