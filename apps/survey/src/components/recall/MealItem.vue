<template>
  <v-list-group :value="mealTimeString.length > 0 ? true : false">
    <template #activator>
      <v-list-item-title class="font-weight-bold text-wrap" @click="chooseMeal">
        {{ getLocaleContent(meal.name) }}
      </v-list-item-title>
      <context-menu
        :menu="menuMeal"
        :entity-name="meal.name.en"
        :icon="menuMealIcon"
        @context-menu-action="onContextMenuAction"
      ></context-menu>
      <v-list-item-action>
        <v-list-item-action-text v-if="mealTimeString.length > 0">
          {{ mealTimeString }}
        </v-list-item-action-text>
        <v-icon v-else x-small>far fa-question-circle </v-icon>
      </v-list-item-action>
    </template>
    <food-item :foods="meal.foods" @food-selected="onFoodSelected"></food-item>
  </v-list-group>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { localeContent, timeDoubleDigitsConvertor } from '@intake24/survey/components/mixins';

import ContextMenu from '../elements/ContextMenu.vue';
import FoodItem from './FoodItem.vue';

export type MealAction = 'edit-foods' | 'edit-time' | 'delete-meal';

export default defineComponent({
  name: 'MealItem',

  components: { ContextMenu, FoodItem },

  mixins: [localeContent],

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
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

  computed: {
    mealTimeString(): string {
      return this.meal.time
        ? timeDoubleDigitsConvertor(this.meal.time.hours)
            .concat(':')
            .concat(timeDoubleDigitsConvertor(this.meal.time.minutes))
        : '';
    },
  },
  methods: {
    chooseMeal() {
      this.$emit('breadcrumbMeal', this.meal.name.en);
      this.$emit('meal-selected', this.meal.id);
    },
    chooseFood(foodName: string) {
      this.$emit('breadcrumbFood', foodName);
    },
    onContextMenuAction(action: string) {
      this.$emit('meal-action', {
        mealId: this.meal.id,
        action,
      });
    },
    onFoodSelected(foodId: number) {
      this.$emit('food-selected', foodId);
    },
  },
});
</script>
