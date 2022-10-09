<template>
  <cereal-prompt
    v-bind="{ continueEnabled, parameters, promptComponent, promptProps }"
    :food-name="foodName()"
    :initial-state="initialStateNotNull"
    @continue="$emit('continue')"
    @update="onUpdate"
  ></cereal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { CerealPromptProps, PortionSizeComponentType } from '@intake24/common/prompts';
import type { CerealParameters } from '@intake24/common/types/http';
import type { CerealPromptState } from '@intake24/survey/components/prompts/portion/CerealPrompt.vue';
import {
  createPromptHandlerStoreMixin,
  foodPromptUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { CerealPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'CerealPromptHandler',

  components: { CerealPrompt },

  mixins: [foodPromptUtils, createPromptHandlerStoreMixin<CerealPromptState>('cereal-prompt')],

  props: {
    promptProps: {
      type: Object as PropType<CerealPromptProps>,
      required: true,
    },
    promptComponent: {
      type: String as PropType<PortionSizeComponentType>,
      required: true,
    },
  },

  computed: {
    parameters(): CerealParameters {
      if (this.selectedPortionSize().method !== 'cereal')
        throw new Error('Selected portion size method must be "cereal"');

      return this.selectedPortionSize().parameters as unknown as CerealParameters;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    getFoodOrMealId(): number {
      return this.selectedFood().id;
    },

    getInitialState(): CerealPromptState {
      return {
        portionSize: {
          method: 'cereal',
          type: this.parameters.type,
          bowl: null,
          bowlIndex: undefined,
          serving: null,
          leftovers: null,
          servingWeight: 0,
          leftoversWeight: 0,
        },
        panel: 0,
        objectConfirmed: false,
        servingImageConfirmed: false,
        leftoversPrompt: undefined,
        leftoversImageConfirmed: false,
      };
    },

    isValid(state: CerealPromptState): boolean {
      const objectValid = state.portionSize.bowlIndex !== undefined && state.objectConfirmed;
      const servingValid = !!state.portionSize.serving && state.servingImageConfirmed;
      const leftoversValid =
        state.leftoversPrompt === false ||
        (!!state.portionSize.leftovers && state.leftoversImageConfirmed);

      return objectValid && servingValid && leftoversValid;
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
