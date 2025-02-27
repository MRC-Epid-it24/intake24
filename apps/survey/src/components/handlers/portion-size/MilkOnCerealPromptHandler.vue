<template>
  <milk-on-cereal-prompt
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
      panel: food().portionSizeMethodIndex !== null ? 1 : 0,
      bowlConfirmed: false,
      milkLevelConfirmed: false,
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
