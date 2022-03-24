<template>
  <v-list-group :value="meal.time.length > 0 ? true : false">
    <template v-slot:activator>
      <v-list-item-title class="font-weight-bold text-wrap" @click="chooseMeal(meal.name)">
        {{ meal.name }}
      </v-list-item-title>
      <context-menu
        :menu="menuMeal"
        :entityName="meal.name"
        :icon="menuMealIcon"
        @context-menu-action="onContextMenuAction"
      ></context-menu>
      <v-list-item-action>
        <v-list-item-action-text
          v-if="meal.time.length > 0"
          v-text="meal.time"
        ></v-list-item-action-text>
        <v-icon x-small v-else>far fa-question-circle </v-icon>
      </v-list-item-action>
    </template>
    <food-item :foods="meal.foods" @food-selected="onFoodSelected"></food-item>
  </v-list-group>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import ContextMenu from '../elements/ContextMenu.vue';
import FoodItem from './FoodItem.vue';

export type MealAction = 'edit-foods' | 'edit-time' | 'delete-meal';

export default defineComponent({
  name: 'MealItem',

  components: { ContextMenu, FoodItem },

  props: {
    meal: Object,
    mealIndex: Number,
  },

  data() {
    return {
      menuMealIcon: 'far fa-edit',
      menuMeal: [
        {
          name: this.$t('recall.menu.meal.editFoodInMeal'),
          action: 'edit-foods',
          dialog: false,
        },
        {
          name: this.$t('recall.menu.meal.editMealTime'),
          action: 'edit-time',
          dialog: false,
        },
        {
          name: this.$t('recall.menu.meal.deleteMeal'),
          action: 'delete-meal',
          dialog: true,
        },
      ],
    };
  },
  methods: {
    chooseMeal(mealName: string) {
      this.$emit('breadcrumbMeal', mealName);
    },
    chooseFood(foodName: string) {
      this.$emit('breadcrumbFood', foodName);
    },
    onContextMenuAction(action: string) {
      this.$emit('meal-action', {
        mealIndex: this.mealIndex,
        action,
      });
    },
    onFoodSelected(foodIndex: number) {
      this.$emit('food-selected', {
        mealIndex: this.mealIndex,
        foodIndex,
      });
    },
  },
});
</script>
