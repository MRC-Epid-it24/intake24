<template>
  <v-list-group :value="meal.time">
    <template #activator>
      <v-list-item-icon>
        <v-icon :color="active ? 'success' : 'grey'">$meal</v-icon>
      </v-list-item-icon>
      <v-list-item-title class="font-weight-bold text-wrap" @click="chooseMeal">
        {{ meal.name }}
      </v-list-item-title>
      <context-menu
        :icon="menuMealIcon"
        :menu="menuMeal"
        @context-menu-action="onContextMenuAction"
      ></context-menu>
      <v-list-item-action>
        <v-list-item-action-text v-if="meal.time">
          {{ meal.time }}
        </v-list-item-action-text>
        <v-icon v-else x-small>far fa-question-circle</v-icon>
      </v-list-item-action>
    </template>
    <review-food :foods="meal.foods" @food-selected="onFoodSelected"></review-food>
  </v-list-group>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { ContextMenu } from '@intake24/survey/components/elements';
import ReviewFood from '@intake24/survey/components/recall/mobile/review/ReviewFood.vue';

export type MealAction = 'edit-foods' | 'edit-time';

export default defineComponent({
  name: 'ReviewMeal',

  components: { ReviewFood, ContextMenu },

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    mealIndex: {
      type: Number,
    },
    active: {
      type: Boolean,
    },
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
    chooseMeal() {
      this.$emit('breadcrumbMeal', this.meal.name.en);
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
