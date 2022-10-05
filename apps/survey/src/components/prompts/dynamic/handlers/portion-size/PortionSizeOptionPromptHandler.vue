<template>
  <portion-size-option-prompt
    v-bind="{ continueEnabled, promptComponent, promptProps, availableMethods }"
    :food-name="foodName()"
    :initial-state="initialStateNotNull"
    @continue="$emit('continue')"
    @update="onUpdate"
  >
  </portion-size-option-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type {
  PortionSizeComponentType,
  PortionSizeOptionPromptProps,
} from '@intake24/common/prompts';
import type { UserPortionSizeMethod } from '@intake24/common/types/http';
import type { PortionSizeOptionState } from '@intake24/survey/components/prompts/portion/PortionSizeOptionPrompt.vue';
import {
  createPromptHandlerStoreMixin,
  foodPromptUtils,
  mealPromptUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { PortionSizeOptionPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'PortionSizeOptionPromptHandler',

  components: { PortionSizeOptionPrompt },

  mixins: [
    foodPromptUtils,
    mealPromptUtils,
    createPromptHandlerStoreMixin<PortionSizeOptionState>('portion-size-option-prompt'),
  ],

  props: {
    promptProps: {
      type: Object as PropType<PortionSizeOptionPromptProps>,
      required: true,
    },
    promptComponent: {
      type: String as PropType<PortionSizeComponentType>,
      required: true,
    },
  },

  computed: {
    availableMethods(): UserPortionSizeMethod[] {
      return this.encodedSelectedFood().data.portionSizeMethods;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['replaceFood']),

    getInitialState(): PortionSizeOptionState {
      return {
        option: this.encodedSelectedFood().portionSizeMethodIndex,
      };
    },

    isValid(state: PortionSizeOptionState): boolean {
      return state.option !== null;
    },

    getFoodOrMealId(): number {
      return this.selectedFood().id;
    },

    commitAnswer() {
      const encodedSelectedFood = this.encodedSelectedFood();

      this.replaceFood({
        foodId: encodedSelectedFood.id,
        food: { ...encodedSelectedFood, portionSizeMethodIndex: this.currentStateNotNull.option },
      });

      this.clearStoredState();
    },
  },
});
</script>
