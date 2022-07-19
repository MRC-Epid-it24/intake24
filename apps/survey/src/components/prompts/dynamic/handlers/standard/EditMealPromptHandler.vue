<template>
  <edit-meal-prompt
    ref="prompt"
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :food-list="initialState.foods"
    :prompt-component="promptComponent"
    :v-on="$listeners"
    @delete-meal="onDeleteMeal"
    @update="onUpdate"
    @complete="onCompletion"
  >
  </edit-meal-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { FoodState, RecallPromptHandler } from '@intake24/common/types';
import { mapActions, mapState } from 'pinia';
import EditMealPrompt, {
  EditMealPromptMethods,
} from '@intake24/survey/components/prompts/standard/EditMealPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import {
  createPromptHandlerMixin,
  PromptHandlerUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-handler-utils';
import MealPromptUtils, {
  MealPromptUtilsType,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins/meal-prompt-utils';

type Refs = {
  $refs: {
    prompt: EditMealPromptMethods;
  };
};

interface EditMealState {
  foods: FoodState[];
}

export default (
  Vue as VueConstructor<
    Vue & RecallPromptHandler & Refs & PromptHandlerUtils<EditMealState> & MealPromptUtilsType
  >
).extend({
  name: 'MealAddPromptHandler',

  mixins: [MealPromptUtils, createPromptHandlerMixin<EditMealState>('edit-meal-prompt')],

  components: { EditMealPrompt },

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
    this.loadInitialState(this.selectedMealRequired.id, this.promptId, {
      foods: this.selectedMealRequired.foods,
    });
  },

  computed: {
    ...mapState(useSurvey, ['defaultSchemeMeals', 'selectedMeal', 'selectedMealIndex']),
  },

  mounted() {
    this.$emit(
      'completion-update',
      this.initialState != null && this.initialState.foods.length > 0
    );
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods', 'deleteMeal']),

    onUpdate(foodList: FoodState[]) {
      this.updateStoredState(this.selectedMealRequired.id, this.promptId, { foods: foodList });
      this.setCompletionState(foodList.length > 0);
      // this.$emit('completion-update', foodList.length > 0);
    },

    onDeleteMeal() {
      this.deleteMeal(this.selectedMealIndexRequired);
      this.clearStoredState(this.selectedMealRequired.id, this.promptId);
    },

    commitAnswer() {
      const foods = this.$refs.prompt?.foodsDrinks();

      this.setFoods({ mealIndex: this.selectedMealIndexRequired, foods });
      this.clearStoredState(this.selectedMealRequired.id, this.promptId);
      return true;
    },

    onCompletion() {
      const commitFoodAndDrinks = this.commitAnswer();
      if (commitFoodAndDrinks) this.$emit('complete');
      else console.log('No Food was commited as an Answer: ', commitFoodAndDrinks);
    },
  },
});
</script>
