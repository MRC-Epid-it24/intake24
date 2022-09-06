<template>
  <v-card>
    <v-list class="flex-grow-1 flex-shrink-0" dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> {{ $t('recall._') }} </v-list-item-title>
          <v-list-item-subtitle>
            {{ surveyName }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <context-menu
          :icon="menuRecallIcon"
          :menu="menuRecall"
          @context-menu-action="onRecallAction"
        >
        </context-menu>
      </v-list-item>
      <v-divider></v-divider>
      <v-card-text class="scroll-y pl-0 pr-0" style="height: 40rem">
        <v-list-item
          v-for="meal in meals"
          :key="meal.id"
          class="pl-1 pr-1"
          :inactive="true"
          link
          :ripple="false"
        >
          <v-list-item-content class="pl-1 pr-1">
            <meal-item
              :meal="meal"
              :selected="selectedMealId === meal.id"
              :selected-food-id="selectedFoodId"
              :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
              @breadcrumbFood="chooseFoodUp"
              @breadcrumbMeal="chooseMealUp(meal.name.en)"
              @food-selected="onFoodSelected"
              @meal-action="onMealAction"
              @meal-selected="onMealSelected"
            ></meal-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-list>
    <v-card-actions>
      <v-hover v-slot="{ hover }">
        <v-btn
          block
          :color="hover ? 'success' : 'inherit'"
          elevation="0"
          @click="onRecallAction('add-meal')"
        >
          {{ $t('recall.menu.recall.addMeal') }}
        </v-btn>
      </v-hover>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndexRequired } from '@intake24/survey/stores/meal-food-utils';

import ContextMenu from '../elements/ContextMenu.vue';
import MealItem from './MealItem.vue';

export type RecallAction = 'add-meal' | 'review-confirm';

export default defineComponent({
  name: 'MealList',

  components: { MealItem, ContextMenu },

  props: {
    surveyName: {
      type: String,
      required: true,
    },
    surveyId: {
      type: String,
      required: true,
    },
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
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

  computed: {
    ...mapState(useSurvey, ['selection']),

    selectedMealId() {
      if (this.selection.element === null || this.selection.element.type !== 'meal')
        return undefined;
      return this.selection.element.mealId;
    },
    selectedFoodId() {
      if (this.selection.element === null || this.selection.element.type !== 'food')
        return undefined;
      return this.selection.element.foodId;
    },
  },

  methods: {
    isSelectedFoodInMeal(mealId: number): boolean {
      if (this.selection.element === null || this.selection.element.type !== 'food') return false;

      const foodIndex = getFoodIndexRequired(this.meals, this.selection.element.foodId);

      return this.meals[foodIndex.mealIndex].id === mealId;
    },
    chooseMealUp(meal: string) {
      this.$emit('breadcrimbMealUp', meal);
    },
    chooseFoodUp(e: string) {
      this.$emit('breadcrimbFoodUp', e);
    },
    onMealAction(payload: { mealId: number; action: string }) {
      this.$emit('meal-action', payload);
    },
    onRecallAction(action: string) {
      this.$emit('recall-action', action);
    },
    onFoodSelected(foodId: number) {
      this.$emit('food-selected', foodId);
    },
    onMealSelected(mealId: number) {
      this.$emit('meal-selected', mealId);
    },
  },
});
</script>

<style lang="scss">
@import '../../scss/meallist.scss';
</style>
