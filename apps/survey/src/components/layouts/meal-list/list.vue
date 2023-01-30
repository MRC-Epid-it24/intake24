<template>
  <v-card>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">{{ $t('recall._') }}</v-list-item-title>
          <v-list-item-subtitle>{{ surveyName }}</v-list-item-subtitle>
        </v-list-item-content>
        <context-menu :icon="menuRecallIcon" :menu="menuRecall" @action="action"></context-menu>
      </v-list-item>
    </v-list>
    <v-list class="meal-list" dense flat tile>
      <template v-for="meal in meals">
        <component
          :is="expandable ? 'meal-item-expandable' : 'meal-item'"
          :key="meal.id"
          :meal="meal"
          :selected="selectedMealId === meal.id"
          :selected-food-id="selectedFoodId"
          :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
          @food-selected="foodSelected"
          @meal-action="mealAction"
          @meal-selected="mealSelected"
        ></component>
      </template>
    </v-list>
    <v-card-actions>
      <v-hover v-slot="{ hover }">
        <v-btn block :color="hover ? 'secondary' : 'inherit'" depressed @click="action('addMeal')">
          {{ $t('recall.menu.recall.addMeal') }}
        </v-btn>
      </v-hover>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { ContextMenu } from '@intake24/survey/components/elements';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndexRequired } from '@intake24/survey/stores/meal-food-utils';

import MealItem from './meal-item.vue';
import MealItemExpandable from './meal-item-expandable.vue';

export default defineComponent({
  name: 'MealList',

  components: { ContextMenu, MealItem, MealItemExpandable },

  props: {
    expandable: {
      type: Boolean,
      default: false,
    },
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
    surveyName: {
      type: String,
      required: true,
    },
  },

  emits: ['action', 'food-selected', 'meal-selected', 'meal-action'],

  data() {
    return {
      menuRecallIcon: 'fas fa-angle-double-right',
      menuRecall: [{ name: 'Add Meal', action: 'addMeal' }],
    };
  },

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
    isSelectedFoodInMeal(mealId: number): boolean {
      if (this.selection.element?.type !== 'food') return false;

      const foodIndex = getFoodIndexRequired(this.meals, this.selection.element.foodId);

      return this.meals[foodIndex.mealIndex].id === mealId;
    },
    action(type: string) {
      this.$emit('action', type);
    },
    foodSelected(foodId: number) {
      this.$emit('food-selected', foodId);
    },
    mealSelected(mealId: number) {
      this.$emit('meal-selected', mealId);
    },
    mealAction(payload: { mealId: number; type: string }) {
      this.$emit('meal-action', payload);
    },
  },
});
</script>

<style lang="scss">
.meal-list {
  .selected {
    background: #fff3e0;
  }

  .selected-food {
    background: #ffe0b2;
  }

  .v-list-group__header {
    padding-left: 12px !important;
  }

  .v-list-item:hover {
    background: #fff3e0;
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
