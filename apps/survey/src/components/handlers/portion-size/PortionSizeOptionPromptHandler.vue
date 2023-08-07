<template>
  <portion-size-option-prompt
    v-bind="{
      availableMethods,
      food,
      meal,
      initialState: state,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  >
  </portion-size-option-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/types';
import { PortionSizeOptionPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'PortionSizeOptionPromptHandler',

  components: { PortionSizeOptionPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['portion-size-option-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const { encodedFood, parentFoodOptional: parentFood } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();

    const food = encodedFood();

    const getInitialState = (): PromptStates['portion-size-option-prompt'] => ({
      option: food.portionSizeMethodIndex,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(props, getInitialState);

    const survey = useSurvey();

    const availableMethods = computed(() =>
      food.data.portionSizeMethods.filter((item) =>
        survey.registeredPortionSizeMethods.includes(item.method)
      )
    );

    const commitAnswer = () => {
      const update: Partial<Omit<EncodedFood, 'type'>> = {
        portionSizeMethodIndex: state.value.option,
      };

      if (
        food.portionSizeMethodIndex !== null &&
        food.portionSizeMethodIndex !== state.value.option
      ) {
        update.portionSize = null;
      }

      survey.updateFood({ foodId: food.id, update });
      survey.addFoodFlag(food.id, 'portion-size-option-complete');

      clearStoredState();
    };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next') commitAnswer();

      emit('action', type, ...args);
    };

    return {
      food,
      meal,
      parentFood,
      state,
      update,
      action,
      availableMethods,
    };
  },
});
</script>
