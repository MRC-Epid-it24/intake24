<template>
  <guide-image-prompt
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
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { GuideImagePrompt } from '@intake24/survey/components/prompts';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'GuideImagePromptHandler',

  components: { GuideImagePrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['guide-image-prompt']>,
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
    } = useFoodPromptUtils<'guide-image'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['guide-image-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'guide-image',
        guideImageId: '',
        imageUrl: null,
        objectId: undefined,
        objectIndex: undefined,
        objectWeight: 0,
        quantity: 1,
        linkedQuantity: 1,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      objectConfirmed: false,
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
