<template>
  <guide-image-prompt
    v-bind="{
      conversionFactor,
      food: food(),
      linkedQuantityCategories,
      meal,
      initialState: state,
      parameters,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  >
  </guide-image-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
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
  },

  emits: ['action'],

  setup(props, { emit }) {
    const {
      conversionFactor,
      encodedFood: food,
      encodedFoodPortionSizeData,
      linkedQuantityCategories,
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
      linkedQuantity: 1,
      linkedQuantityConfirmed: false,
    });

    const { state, update, commitPortionSize } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState
    );

    const action = (type: string, id?: string) => {
      if (type === 'next') commitPortionSize();

      emit('action', type, id);
    };

    return {
      conversionFactor,
      food,
      linkedQuantityCategories,
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
