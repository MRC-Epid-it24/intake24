<template>
  <portion-size-option-prompt
    v-bind="{ foodName, promptProps, availableMethods }"
    :prompt-component="promptComponent"
    :initial-value="option"
    v-on="$listeners"
    @update="onUpdate"
  >
  </portion-size-option-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { RecallPromptHandler } from '@intake24/common/types';
import { UserPortionSizeMethod } from '@intake24/common/types/http';
import PortionSizeOptionPrompt from '@intake24/survey/components/prompts/portion/PortionSizeOptionPrompt.vue';
import { mapActions } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import FoodPromptUtils, { FoodPromptUtilsType } from '../mixins/food-prompt-utils';
import {
  createPromptHandlerMixin,
  PromptHandlerUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-utils';
import MealPromptUtils, {
  MealPromptUtilsType,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins/meal-prompt-utils';

interface PortionSizeOptionState {
  option: number | null;
}

export default (
  Vue as VueConstructor<
    Vue &
      FoodPromptUtilsType &
      MealPromptUtilsType &
      RecallPromptHandler &
      PromptHandlerUtils<PortionSizeOptionState>
  >
).extend({
  name: 'PortionSizeOptionPromptHandler',

  components: { PortionSizeOptionPrompt },

  mixins: [
    FoodPromptUtils,
    MealPromptUtils,
    createPromptHandlerMixin<PortionSizeOptionState>('portion-size-option-prompt'),
  ],

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

  data() {
    return {
      option: null as number | null,
    };
  },

  computed: {
    availableMethods(): UserPortionSizeMethod[] {
      return this.encodedSelectedFood.data.portionSizeMethods;
    },
  },

  created() {
    this.loadInitialState(this.encodedSelectedFood.id, this.promptId, { option: null });
    this.option = this.initialState?.option ?? null;
    this.setCompletionState(this.option !== null);
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    onUpdate(option: number | null) {
      this.updateStoredState(this.encodedSelectedFood.id, this.promptId, { option });
      this.option = option;
      this.setCompletionState(this.option !== null);
    },

    commitAnswer() {
      this.updateFood({
        mealIndex: this.selectedMealIndexRequired,
        foodIndex: this.selectedFoodIndexRequired,
        food: { portionSizeMethodIndex: this.option },
      });

      this.clearStoredState(this.encodedSelectedFood.id, this.promptId);
    },
  },
});
</script>
