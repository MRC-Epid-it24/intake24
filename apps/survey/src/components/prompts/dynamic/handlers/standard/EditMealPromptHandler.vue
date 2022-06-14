<template>
  <edit-meal-prompt
    ref="prompt"
    :meal-name="selectedMeal.name"
    :prompt-props="promptProps"
    :food-list="foods"
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
import { useEditMealState } from '@intake24/survey/stores/edit-meal';

type Refs = {
  $refs: {
    prompt: EditMealPromptMethods;
  };
};
export default (Vue as VueConstructor<Vue & RecallPromptHandler & Refs>).extend({
  name: 'MealAddPromptHandler',

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
  },

  computed: {
    ...mapState(useSurvey, ['defaultSchemeMeals', 'selectedMeal', 'selectedMealIndex']),

    foods(): FoodState[] {
      if (this.selectedMeal === undefined) {
        console.warn('Expected a meal to be selected');
        return [];
      }

      const storedState = useEditMealState().mealState[this.selectedMeal.id];
      return storedState ?? this.selectedMeal.foods;
    },
  },

  mounted() {
    this.$emit('completion-update', this.foods.length > 0);
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods', 'deleteMeal']),
    ...mapActions(useEditMealState, ['updateMealState', 'clearMealState']),

    onUpdate(foodList: FoodState[]) {
      if (this.selectedMeal === undefined) {
        console.warn('Expected a meal to be selected');
      } else {
        this.updateMealState(this.selectedMeal.id, foodList);
        this.$emit('completion-update', foodList.length > 0);
      }
    },

    onDeleteMeal() {
      if (this.selectedMealIndex === undefined || this.selectedMeal === undefined) {
        console.warn('No selected meal, meal index undefined');
        return;
      }

      this.deleteMeal(this.selectedMealIndex);
      this.clearMealState(this.selectedMeal.id);
    },

    commitAnswer() {
      const foods = this.$refs.prompt?.foodsDrinks();

      if (this.selectedMealIndex === undefined || this.selectedMeal === undefined) {
        console.warn('No selected meal, meal index undefined');
        return false;
      }

      this.setFoods({ mealIndex: this.selectedMealIndex, foods });
      this.clearMealState(this.selectedMeal.id);
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
