<template>
  <v-card>
    <v-list dense nav class="flex-grow-1 flex-shrink-0">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> {{ $t('recall._') }} </v-list-item-title>
          <v-list-item-subtitle>
            {{ surveyName }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <context-menu
          :menu="menuRecall"
          :icon="menuRecallIcon"
          @context-menu-action="onRecallAction"
        >
        </context-menu>
      </v-list-item>
      <v-divider></v-divider>
      <v-card-text class="scroll-y" style="height: 40rem">
        <v-list-item
          :ripple="false"
          :inactive="true"
          v-for="(meal, idx) in meals"
          :key="meal.name + idx"
          link
        >
          <v-list-item-content>
            <meal-item
              :meal="meal"
              :meal-id="meal.id"
              @meal-action="onMealAction"
              @food-selected="onFoodSelected"
              @meal-selected="onMealSelected"
              @breadcrumbMeal="chooseMealUp(meal.name)"
              @breadcrumbFood="chooseFoodUp"
            ></meal-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-list>
    <v-card-actions>
      <v-hover v-slot="{ hover }">
        <v-btn
          :color="hover ? 'success' : 'inherit'"
          elevation="0"
          block
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
import { defineComponent } from 'vue';
import MealItem from './MealItem.vue';
import ContextMenu from '../elements/ContextMenu.vue';
import type { MealState } from '@intake24/common/types';

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
