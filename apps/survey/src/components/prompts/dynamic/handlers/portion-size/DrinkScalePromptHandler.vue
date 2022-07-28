<template>
  <drink-scale-prompt
    ref="promptHandleChild"
    v-bind="{ foodName, promptProps }"
    :initial-fill-level="parameters['initial-fill-level']"
    :drinkware-id="parameters['drinkware-id']"
    :skip-fill-level="parameters['skip-fill-level']"
    :prompt-component="promptComponent"
    :initial-state="initialState"
    :continue-enabled="continueEnabled"
    @continue="$emit('continue')"
    @update="onUpdate"
  >
  </drink-scale-prompt>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { useFoodGuideImageState } from '@intake24/survey/stores/guide-image';
import type { BasePromptProps } from '@intake24/common/prompts';
import type { DrinkScaleParameters } from '@intake24/common/types/http';
import type { DrinkScalePromptState } from '@intake24/survey/components/prompts/portion/DrinkScalePrompt.vue';
import DrinkScalePrompt from '@intake24/survey/components/prompts/portion/DrinkScalePrompt.vue';
import foodPromptUtils from '../mixins/food-prompt-utils';
import { createPromptStoreMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-store';

export default defineComponent({
  name: 'DrinkScalePromptHandler',

  components: { DrinkScalePrompt },

  mixins: [foodPromptUtils, createPromptStoreMixin<DrinkScalePromptState>('drink-scale-prompt')],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
  },

  created() {
    this.loadInitialState(this.encodedSelectedFood.id, this.promptId, {
      // Placeholders for testying state
      portionSize: {
        method: 'drink-scale',
        object: null,
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
      drinkScaleAmount: false,
      objectIdx: undefined,
      panelOpen: 0,
    });
  },

  mounted() {
    this.setValidationState(this.isValid(this.initialState));
  },

  data() {
    return {
      currentState: null as DrinkScalePromptState | null,
    };
  },

  computed: {
    parameters(): DrinkScaleParameters {
      if (this.selectedPortionSize.method !== 'drink-scale')
        throw new Error('Selected portion size method must be "drink-scale"');

      return this.selectedPortionSize.parameters as unknown as DrinkScaleParameters;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),
    ...mapActions(useFoodGuideImageState, ['updateFoodState', 'clearFoodState']),

    isValid(state: DrinkScalePromptState | null): boolean {
      if (state === null) return false;

      return state.objectIdx !== undefined && state.objectConfirmed && state.quantityConfirmed;
    },

    onUpdate(newState: DrinkScalePromptState) {
      this.updateStoredState(this.encodedSelectedFood.id, this.promptId, newState);
      this.setValidationState(this.isValid(newState));
    },

    async commitAnswer() {
      if (this.currentState === null) throw new Error('currentState is null');

      this.updateFood({
        foodId: this.selectedFood.id,
        update: {
          portionSize: this.currentState.portionSize,
        },
      });

      this.clearStoredState(this.selectedFood.id, this.promptId);
    },
  },
});
</script>
