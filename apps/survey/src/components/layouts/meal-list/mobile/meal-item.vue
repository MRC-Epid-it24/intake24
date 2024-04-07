<template>
  <div>
    <v-list-item
      :key="meal.id"
      :class="{
        'selected': contextId ? meal.id === contextId : isSelected || selectedFoodInMeal,
        'selected-food': !contextId && selectedFoodInMeal,
      }"
      @click="updateContextId(meal.id)"
    >
      <v-list-item-content>
        <v-list-item-title class="font-weight-bold text-wrap">
          {{ mealName }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action v-if="meal.time">
        <v-list-item-action-text>
          {{ mealTime }}
        </v-list-item-action-text>
      </v-list-item-action>
      <v-list-item-action class="my-auto">
        <v-icon :class="{ 'fa-rotate-180': meal.id === contextId }">
          $expand
        </v-icon>
      </v-list-item-action>
    </v-list-item>
    <context-menu v-bind="{ contextId, meal, menu }" @action="action" />
    <v-divider />
    <template v-if="meal.foods.length">
      <food-item
        v-for="food in meal.foods"
        :key="food.id"
        v-bind="{ contextId, food, meal, selectedFoodId }"
        @action="action"
        @update:context-id="updateContextId"
      />
      <v-divider />
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
    contextId: {
      type: String,
    },
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

  setup(props, ctx) {
    const { action, isSelected, menu, mealName, mealTime } = useMealItem(props, ctx);

    const updateContextId = (id: string) => {
      ctx.emit('update:context-id', id);
    };

    return {
      action,
      isSelected,
      menu,
      mealName,
      mealTime,
      updateContextId,
    };
  },
});
</script>

<style lang="scss"></style>
