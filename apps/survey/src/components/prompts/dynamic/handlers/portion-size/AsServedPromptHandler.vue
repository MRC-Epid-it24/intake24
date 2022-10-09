<template>
  <as-served-prompt
    v-bind="{ continueEnabled, parameters, promptComponent, promptProps }"
    :food-name="foodName()"
    :initial-state="initialStateNotNull"
    @continue="$emit('continue')"
    @update="onUpdate"
  ></as-served-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { AsServedPromptProps, PortionSizeComponentType } from '@intake24/common/prompts';
import type { AsServedParameters } from '@intake24/common/types/http';
import type { AsServedPromptState } from '@intake24/survey/components/prompts/portion/AsServedPrompt.vue';
import {
  createPromptHandlerStoreMixin,
  foodPromptUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { AsServedPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'AsServedPromptHandler',

  components: { AsServedPrompt },

  mixins: [foodPromptUtils, createPromptHandlerStoreMixin<AsServedPromptState>('as-served-prompt')],

  props: {
    promptProps: {
      type: Object as PropType<AsServedPromptProps>,
      required: true,
    },
    promptComponent: {
      type: String as PropType<PortionSizeComponentType>,
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
        portionSize: {
          method: 'as-served',
          serving: null,
          leftovers: null,
          servingWeight: 0,
          leftoversWeight: 0,
        },
        panel: 0,
        servingImageConfirmed: false,
        leftoversPrompt: undefined,
        leftoversImageConfirmed: false,
      };
    },

    isValid(state: AsServedPromptState): boolean {
      const servingValid = !!state.portionSize.serving && state.servingImageConfirmed;
      const leftoversValid =
        state.leftoversPrompt === false ||
        (!!state.portionSize.leftovers && state.leftoversImageConfirmed);

      const noLeftovers = !this.parameters['leftovers-image-set'];

      return servingValid && (noLeftovers || leftoversValid);
    },

    async commitAnswer() {
      const { portionSize } = this.currentStateNotNull;

      this.updateFood({
        foodId: this.selectedFood().id,
        update: {
          portionSize: {
            ...portionSize,
            servingWeight: portionSize.serving?.weight ?? 0,
            leftoversWeight: portionSize.leftovers?.weight ?? 0,
          },
        },
      });
    },
  },
});
</script>
