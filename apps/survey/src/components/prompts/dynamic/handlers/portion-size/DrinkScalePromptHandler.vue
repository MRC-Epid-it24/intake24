<template>
  <drink-scale-prompt
    v-bind="{
      foodName: foodName(),
      initialState: state,
      parameters,
      promptComponent,
      promptProps,
    }"
    @continue="$emit('continue')"
    @update="update"
  >
  </drink-scale-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { DrinkScalePromptProps, PortionSizeComponentType } from '@intake24/common/prompts';
import type { DrinkScalePromptState } from '@intake24/survey/components/prompts/portion/DrinkScalePrompt.vue';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { DrinkScalePrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'DrinkScalePromptHandler',

  components: { DrinkScalePrompt },

  props: {
    promptComponent: {
      type: String as PropType<PortionSizeComponentType>,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<DrinkScalePromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const { foodName, parameters, selectedFood } = useFoodPromptUtils<'drink-scale'>();

    const getInitialState = (): DrinkScalePromptState => ({
      portionSize: {
        method: 'drink-scale',
        drinkwareId: '',
        initialFillLevel: 0.9,
        skipFillLevel: false,
        imageUrl: '',
        containerIndex: undefined,
        fillLevel: 0,
        servingWeight: 0,
        leftoversWeight: 0,
        leftoversLevel: 0,
        leftovers: false,
      },
      panel: 0,
      objectConfirmed: false,
      quantityConfirmed: false,
      leftoversConfirmed: false,
      leftoversPrompt: undefined,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.promptId,
      props.promptComponent,
      getInitialState,
      context
    );

    return {
      foodName,
      parameters,
      selectedFood,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    async commitAnswer() {
      const { portionSize } = this.state;

      this.updateFood({ foodId: this.selectedFood().id, update: { portionSize } });
      this.clearStoredState();
    },
  },
});
</script>
