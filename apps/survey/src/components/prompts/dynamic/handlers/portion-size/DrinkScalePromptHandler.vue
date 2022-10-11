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

  setup(props) {
    const { foodName, parameters, selectedFood } = useFoodPromptUtils<'drink-scale'>();

    const getInitialState = (): DrinkScalePromptState => ({
      portionSize: {
        method: 'drink-scale',
        leftoversLevel: 0,
        initialFillLevel: '0.9',
        fillLevel: 0,
        skipFillLevel: 'false',
        imageUrl: '',
        leftoversWeight: 0,
        drinkwareId: '',
        containerIndex: 0,
        leftovers: false,
        servingWeight: 0,
      },
      objectConfirmed: false,
      drinkConfirmed: false,
      leftoversConfirmed: false,
      objectIdx: undefined,
      drinkOverlayUrl: '',
      maxDrinkSliderValue: 100,
      panel: 0,
      minDrinkSliderValue: 0,
      originalImageUrlHeight: 0,
      originalImageUrlWidth: 0,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.promptId,
      props.promptComponent,
      getInitialState
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
