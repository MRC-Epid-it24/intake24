<template>
  <div>
    <v-list-item
      :class="{ selected: isSelected || selectedFoodInMeal, 'selected-food': selectedFoodInMeal }"
      @click="mealSelected"
    >
      <v-list-item-title class="font-weight-bold text-wrap">
        {{ mealName }}
      </v-list-item-title>
      <v-list-item-action>
        <v-list-item-action-text v-if="mealTime?.length">
          {{ mealTime }}
        </v-list-item-action-text>
        <v-tooltip v-else bottom>
          <template #activator="{ on, attrs }">
            <v-icon v-bind="attrs" small v-on="on">$question</v-icon>
          </template>
          <span>{{ $t('recall.menu.mealSuggested') }}</span>
        </v-tooltip>
      </v-list-item-action>
      <v-list-item-action class="my-auto">
        <context-menu
          :entity="meal"
          :entity-name="mealName"
          v-bind="{ menu }"
          @action="action"
        ></context-menu>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
    <template v-if="meal.foods.length">
      <food-item
        v-for="food in meal.foods"
        :key="food.id"
        v-bind="{ food, selectedFoodId }"
        @action="action"
      ></food-item>
      <v-divider></v-divider>
    </template>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';

import { useMealItem } from '../use-meal-item';
import ContextMenu from './context-menu.vue';
import FoodItem from './food-item.vue';

export default defineComponent({
  name: 'MealItem',

  components: { ContextMenu, FoodItem },

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    selectedFoodId: {
      type: String,
    },
    selectedFoodInMeal: {
      type: Boolean,
      required: true,
    },
    selectedMealId: {
      type: String,
    },
  },

  setup(props, context) {
    const { action, isSelected, menu, mealName, mealTime, mealSelected } = useMealItem(
      props,
      context
    );

    return {
      action,
      isSelected,
      menu,
      mealName,
      mealTime,
      mealSelected,
    };
  },
});
</script>

<style lang="scss"></style>
