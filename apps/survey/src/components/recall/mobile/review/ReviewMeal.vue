<template>
  <v-list-group :value="meal.time.length > 0 ? true : false">
    <template v-slot:activator>
      <v-list-item-icon>
        <v-icon :color="active ? 'success' : 'grey'"> $meal</v-icon>
      </v-list-item-icon>
      <v-list-item-title class="font-weight-bold text-wrap" @click="chooseMeal(meal.name)">
        {{ meal.name }}
      </v-list-item-title>
      <context-menu
        :menu="menuMeal"
        :icon="menuMealIcon"
        @context-menu-action="onContextMenuAction"
      ></context-menu>
      <v-list-item-action>
        <v-list-item-action-text v-if="meal.time.length > 0">
          {{ meal.time }}
        </v-list-item-action-text>
        <v-icon x-small v-else>far fa-question-circle </v-icon>
      </v-list-item-action>
    </template>
    <review-food :foods="meal.foods" @food-selected="onFoodSelected"></review-food>
  </v-list-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ContextMenu from '@intake24/survey/components/elements/ContextMenu.vue';
import ReviewFood from '@intake24/survey/components/recall/mobile/review/ReviewFood.vue';

export type MealAction = 'edit-foods' | 'edit-time';

export default defineComponent({
  name: 'ReviewMeal',

  components: { ReviewFood, ContextMenu },

  props: {
    meal: Object,
    mealIndex: Number,
    active: Boolean,
  },

  data() {
    return {
      menuMealIcon: 'far fa-edit',
      menuMeal: [
        {
          name: 'Add or remove foods',
          action: 'edit-foods',
        },
        {
          name: 'Change meal time',
          action: 'edit-time',
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
