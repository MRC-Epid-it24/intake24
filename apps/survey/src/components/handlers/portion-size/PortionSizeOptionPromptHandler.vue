<template>
  <portion-size-option-prompt
    v-bind="{
      availableMethods,
      food: food(),
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

import type { Prompts } from '@intake24/common/prompts';
import type { PortionSizeOptionState } from '@intake24/survey/components/prompts';
import { PortionSizeOptionPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

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
    const { encodedFood: food, parentFoodOptional: parentFood } = useFoodPromptUtils();

    const getInitialState = (): PortionSizeOptionState => ({
      option: food().portionSizeMethodIndex,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState
    );

    const survey = useSurvey();

    const availableMethods = computed(() =>
      food().data.portionSizeMethods.filter((item) =>
        survey.registeredPortionSizeMethods.includes(item.method)
      )
    );

    const commitAnswer = () => {
      survey.updateFood({
        foodId: food().id,
        update: { portionSizeMethodIndex: state.value.option },
      });

      clearStoredState();
    };

    const action = (type: string, id?: string) => {
      if (type === 'next') commitAnswer();

      emit('action', type, id);
    };

    return {
      food,
      parentFood,
      state,
      update,
      action,
      clearStoredState,
      availableMethods,
    };
  },
});
</script>
