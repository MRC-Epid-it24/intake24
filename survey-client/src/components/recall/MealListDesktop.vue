<template>
  <v-card>
    <v-list dense nav class="flex-grow-1 flex-shrink-0">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Recall </v-list-item-title>
          <v-list-item-subtitle>
            {{ surveyName }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <context-menu
          :menu="menuRecall"
          :icon="menuRecallIcon"
          :itemId="surveyId"
          @manual-prompt-selection="mealAction"
        >
        </context-menu>
      </v-list-item>
      <v-divider></v-divider>
      <v-card-text class="scroll-y" style="height: 40rem">
        <v-list-item
          :ripple="false"
          :inactive="true"
          v-for="(meal, idx) in meals"
          :key="meal.name"
          link
        >
          <v-list-item-content>
            <meal-item
              :meal="meal"
              :idx="idx.toString()"
              @breadcrumbMeal="chooseMealUp(meal.name)"
              @breadcrumbFood="chooseFoodUp"
            ></meal-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import MealItem from './MealItem.vue';
import ContextMenu from '../elements/ContextMenu.vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'MealList',

  components: {
    MealItem,
    ContextMenu,
  },
  props: {
    surveyName: String,
    surveyId: String,
    meals: Array,
  },
  data() {
    return {
      menuRecallIcon: 'fas fa-angle-double-right',
      menuRecall: [
        {
          name: 'Add Meal',
          action: 'add-meal-prompt',
        },
        {
          name: 'Delete Meal',
          action: 'remove-meal-prompt',
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
    mealAction(payload: { action: string; itemId: string }) {
      this.$emit('manual-prompt-selection', payload);
    },
  },
});
</script>

<style lang="scss">
@import '../../scss/meallist.scss';
</style>
