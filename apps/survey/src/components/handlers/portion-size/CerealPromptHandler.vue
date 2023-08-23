<template>
  <cereal-prompt
    v-bind="{
      food: food(),
      meal,
      initialState: state,
      parameters,
      parentFood,
      prompt,
      section,
    }"
    @action="action"
    @update="update"
  ></cereal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { CerealPrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'CerealPromptHandler',

  components: { CerealPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['cereal-prompt']>,
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
    } = useFoodPromptUtils<'cereal'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['cereal-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'cereal',
        imageUrl: null,
        type: parameters.value.type,
        bowl: null,
        bowlId: undefined,
        bowlIndex: undefined,
        serving: null,
        leftovers: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      bowlConfirmed: false,
      servingImageConfirmed: false,
      leftoversPrompt: undefined,
      leftoversImageConfirmed: false,
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
      state,
      action,
      update,
    };
  },
});
</script>
