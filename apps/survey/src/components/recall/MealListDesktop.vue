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
              :meal-index="idx"
              @meal-action="onMealAction"
              @food-selected="onFoodSelected"
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
import { defineComponent } from '@vue/composition-api';
import MealItem from './MealItem.vue';
import ContextMenu from '../elements/ContextMenu.vue';

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
    meals: Array,
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

<style lang="scss">
@import '../../scss/meallist.scss';
</style>
