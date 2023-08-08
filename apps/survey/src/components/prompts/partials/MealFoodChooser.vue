<template>
  <div>
    <v-list-item
      v-for="food in filteredFoods"
      :key="food.id"
      class="list-item-border"
      @click="foodSelected(food)"
    >
      <v-list-item-icon>
        <v-icon>•</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ getFoodDisplayText(food) }} </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { FoodState } from '@intake24/common/types';
import { getFoodDisplayText } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';
import { findMeal, getFoodIndex } from '@intake24/survey/util';

export default defineComponent({
  name: 'MealFoodChooser',

  props: {
    mealId: {
      type: String,
      required: true,
    },
    filter: {
      type: Function as PropType<(foodId: string) => boolean>,
      required: true,
    },
  },

  emits: {
    selected: (food: FoodState) => true,
  },

  setup(props) {
    const store = useSurvey();
    const meal = findMeal(store.currentState.meals, props.mealId);

    const foods = ref<FoodState[]>(meal.foods);

    return { foods };
  },

  computed: {
    filteredFoods(): FoodState[] {
      return this.foods.filter((food) => this.filter(food.id));
    },
  },

  methods: {
    getFoodDisplayText,
    foodSelected(food: FoodState): void {
      this.$emit('selected', food);
    },
  },
});
</script>

<style lang="scss" scoped></style>
