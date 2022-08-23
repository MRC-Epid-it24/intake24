<template>
  <v-card denses flat>
    <survey-progress :items="meals"></survey-progress>
    <v-list class="flex-grow-1 flex-shrink-0" dense flat nav>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Recall</v-list-item-title>
          <v-list-item-subtitle>
            {{ surveyName }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <!-- <context-menu
          :menu="menuRecall"
          :icon="menuRecallIcon"
          @context-menu-action="onRecallAction"
        >
        </context-menu> -->
      </v-list-item>
      <v-card-text>
        <v-list-item
          v-for="(meal, idx) in meals"
          :key="meal.id"
          :inactive="true"
          link
          :ripple="false"
        >
          <v-list-item-content>
            <review-meal
              :active="activeMealIndex === idx"
              :meal="meal"
              :meal-index="idx"
              @breadcrumbFood="chooseFoodUp"
              @breadcrumbMeal="chooseMealUp(meal.name.en)"
              @food-selected="onFoodSelected"
              @meal-action="onMealAction"
            ></review-meal>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import ReviewMeal from '@intake24/survey/components/recall/mobile/review/ReviewMeal.vue';
import SurveyProgress from '@intake24/survey/components/recall/mobile/review/SurveyProgress.vue';
// import ContextMenu from '@intake24/survey/components/elements/ContextMenu.vue';

export type RecallAction = 'add-meal' | 'review-confirm';

export default defineComponent({
  name: 'Review',

  components: {
    ReviewMeal,
    // ContextMenu,
    SurveyProgress,
  },
  props: {
    surveyName: {
      type: String,
    },
    surveyId: {
      type: String,
    },
    meals: {
      type: Array as PropType<MealState[]>,
    },
    activeMealIndex: {
      type: Number,
    },
  },
  data() {
    return {
      menuRecallIcon: 'fas fa-angle-double-right',
      menuRecall: [
        {
          name: 'Add Meal',
          action: 'add-meal',
        },
      ],
    };
  },
  methods: {
    chooseMealUp(meal: string) {
      this.$emit('breadcrimbMealUp', meal);
    },
    chooseFoodUp(e: string) {
      this.$emit('breadcrimbFoodUp', e);
    },
    onMealAction(payload: { mealIndex: number; action: string }) {
      this.$emit('meal-action', payload);
    },
    onRecallAction(action: string) {
      this.$emit('recall-action', action);
    },
    onFoodSelected(payload: { mealIndex: number; foodIndex: number }) {
      this.$emit('food-selected', payload);
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../../scss/meallist.scss';
</style>
