<template>
  <v-list-group
    :class="{ selected: selected || selectedFoodInMeal, 'selected-food': selectedFoodInMeal }"
    flat
    tile
    :value="selected || selectedFoodInMeal"
    @click="mealSelected"
  >
    <template #prependIcon>
      <v-icon :class="{ rotate: selected || selectedFoodInMeal }">$expand</v-icon>
    </template>
    <template #activator>
      <v-list-item-title class="font-weight-bold text-wrap">
        {{ getLocaleContent(meal.name) }}
      </v-list-item-title>
      <v-list-item-action class="mr-4">
        <v-list-item-action-text v-if="mealTimeString.length">
          {{ mealTimeString }}
        </v-list-item-action-text>
        <v-icon v-else small>far fa-question-circle</v-icon>
      </v-list-item-action>
      <v-list-item-action class="my-auto">
        <context-menu
          :entity-name="meal.name.en"
          :icon="menuMealIcon"
          :menu="menuMeal"
          @action="action"
        ></context-menu>
      </v-list-item-action>
    </template>
    <food-item
      :foods="meal.foods"
      :selected-food-id="selectedFoodId"
      @food-selected="foodSelected"
    ></food-item>
  </v-list-group>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { localeContent } from '@intake24/survey/components/mixins';
import { fromMealTime } from '@intake24/survey/stores/meal-food-utils';

import { ContextMenu } from '../elements';
import FoodItem from './FoodItem.vue';

export default defineComponent({
  name: 'MealItem',

  components: { ContextMenu, FoodItem },

  mixins: [localeContent],

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    selectedFoodInMeal: {
      type: Boolean,
      required: true,
    },
    selectedFoodId: {
      type: Number,
      required: false,
    },
  },

  data() {
    return {
      menuMealIcon: 'fas fa-edit',
      menuMeal: [
        {
          name: this.$t('recall.menu.meal.editFoodInMeal'),
          action: 'editMeal',
          dialog: false,
        },
        {
          name: this.$t('recall.menu.meal.editMealTime'),
          action: 'mealTime',
          dialog: false,
        },
        {
          name: this.$t('recall.menu.meal.deleteMeal'),
          action: 'deleteMeal',
          dialog: true,
        },
      ],
    };
  },

  computed: {
    mealTimeString(): string {
      return this.meal.time ? fromMealTime(this.meal.time, true) : '';
    },
  },

  methods: {
    foodSelected(foodId: number) {
      this.$emit('food-selected', foodId);
    },
    mealSelected() {
      this.$emit('meal-selected', this.meal.id);
    },
    action(type: string) {
      this.$emit('meal-action', { mealId: this.meal.id, type });
    },
  },
});
</script>

<style lang="scss"></style>
