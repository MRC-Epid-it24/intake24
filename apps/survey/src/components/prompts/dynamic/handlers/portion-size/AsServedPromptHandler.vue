<template>
  <as-served-prompt
    :as-served-set-id="parameters['serving-image-set']"
    :continue-enabled="continueEnabled"
    :food-name="foodName()"
    :initial-state="initialStateNotNull"
    :prompt-component="promptComponent"
    :prompt-props="promptProps"
    @continue="$emit('continue')"
    @update="onUpdate"
  ></as-served-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { AsServedParameters } from '@intake24/common/types/http';
import type { AsServedPromptState } from '@intake24/survey/components/prompts/portion/AsServedPrompt.vue';
import {
  createPromptHandlerStoreMixin,
  foodPromptUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import AsServedPrompt from '@intake24/survey/components/prompts/portion/AsServedPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'AsServedPromptHandler',

  components: { AsServedPrompt },

  mixins: [foodPromptUtils, createPromptHandlerStoreMixin<AsServedPromptState>('as-served-prompt')],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
  },

  computed: {
    parameters(): AsServedParameters {
      if (this.selectedPortionSize().method !== 'as-served')
        throw new Error('Selected portion size method must be "as-served"');

      return this.selectedPortionSize().parameters as unknown as AsServedParameters;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    getFoodOrMealId(): number {
      return this.selectedFood().id;
    },

    getInitialState(): AsServedPromptState {
      return {
        activePanel: 0,
        servingImage: null,
        servingImageSelected: false,
        leftoversConfirmed: null,
        leftoversImageSelected: false,
        leftoversImage: null,
      };
    },

    isValid(state: AsServedPromptState): boolean {
      const servingValid = state.servingImage !== null && state.servingImageSelected;
      const leftoversConfirmedAndValid =
        state.leftoversConfirmed === true &&
        state.leftoversImage !== null &&
        state.leftoversImageSelected;
      const leftoversSkipped = state.leftoversConfirmed === false;

      return servingValid && (leftoversSkipped || leftoversConfirmedAndValid);
    },

    async commitAnswer() {
      const currentState = this.currentStateNotNull;

      this.updateFood({
        foodId: this.selectedFood().id,
        update: {
          portionSize: {
            method: 'as-served',
            serving: currentState.servingImage,
            leftovers: currentState.leftoversImage,
            servingWeight: currentState.servingImage?.weight || 0,
            leftoversWeight: currentState.leftoversImage?.weight || 0,
          },
        },
      });
    },
  },
});
</script>
