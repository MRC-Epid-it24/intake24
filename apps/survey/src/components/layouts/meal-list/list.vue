<template>
  <v-card>
    <v-card-title>
      {{ $t('recall.menu.title') }}
    </v-card-title>
    <v-divider></v-divider>
    <v-list class="meal-list pt-0" dense flat tile>
      <template v-for="meal in meals">
        <component
          :is="expandable ? 'meal-item-expandable' : 'meal-item'"
          :key="meal.id"
          :meal="meal"
          :selected="selectedMealId === meal.id"
          :selected-food-id="selectedFoodId"
          :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
          @action="action"
          @food-selected="foodSelected"
          @meal-selected="mealSelected"
        ></component>
      </template>
    </v-list>
    <v-card-actions>
      <v-hover v-slot="{ hover }">
        <v-btn block :color="hover ? 'secondary' : 'inherit'" depressed @click="action('addMeal')">
          <v-icon left>$add</v-icon>
          {{ $t('recall.menu.meal.add') }}
        </v-btn>
      </v-hover>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndexRequired } from '@intake24/survey/util';

import MealItem from './meal-item.vue';
import MealItemExpandable from './meal-item-expandable.vue';

export default defineComponent({
  name: 'MealList',

  components: { MealItem, MealItemExpandable },

  props: {
    expandable: {
      type: Boolean,
      default: false,
    },
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  emits: ['action'],

  computed: {
    ...mapState(useSurvey, ['selection']),

    selectedMealId() {
      if (this.selection.element?.type !== 'meal') return undefined;
      return this.selection.element.mealId;
    },
    selectedFoodId() {
      if (this.selection.element?.type !== 'food') return undefined;
      return this.selection.element.foodId;
    },
  },

  methods: {
    isSelectedFoodInMeal(mealId: string): boolean {
      if (this.selection.element?.type !== 'food') return false;

      const foodIndex = getFoodIndexRequired(this.meals, this.selection.element.foodId);

      return this.meals[foodIndex.mealIndex].id === mealId;
    },
    action(type: FoodActionType | MealActionType, id?: string) {
      this.$emit('action', type, id);
    },
    foodSelected(foodId: string) {
      this.action('selectFood', foodId);
    },
    mealSelected(mealId: string) {
      this.action('selectMeal', mealId);
    },
  },
});
</script>

<style lang="scss">
@import 'vuetify/src/styles/styles.sass';

.meal-list {
  .selected {
    background: map-get($orange, 'lighten-5');
  }

  .selected-food {
    background: map-get($orange, 'lighten-4');
  }

  .v-list-group__header {
    padding-left: 12px !important;
  }

  .v-list-item:hover {
    background: map-get($orange, 'lighten-5');
  }

  .v-list-group--active > .v-list-group__header > .v-list-group__header__prepend-icon {
    margin-right: 6px;

    .v-icon {
      transform: rotate(180deg);
    }
  }

  .v-list-group__header__append-icon {
    display: none !important;
  }
}
</style>
