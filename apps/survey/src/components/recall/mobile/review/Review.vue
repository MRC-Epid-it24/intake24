<template>
  <v-card flat denses>
    <survey-progress :items="meals"></survey-progress>
    <v-list flat dense nav class="flex-grow-1 flex-shrink-0">
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
          :ripple="false"
          :inactive="true"
          v-for="(meal, idx) in meals"
          :key="meal.name + idx"
          link
        >
          <v-list-item-content>
            <review-meal
              :meal="meal"
              :meal-index="idx"
              :active="activeMealIndex === idx"
              @meal-action="onMealAction"
              @food-selected="onFoodSelected"
              @breadcrumbMeal="chooseMealUp(meal.name)"
              @breadcrumbFood="chooseFoodUp"
            ></review-meal>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
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
    surveyName: String,
    surveyId: String,
    meals: Array,
    activeMealIndex: Number,
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
