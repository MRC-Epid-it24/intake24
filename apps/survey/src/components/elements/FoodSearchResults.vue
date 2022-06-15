<template>
  <v-list-item-group>
    <v-list-item
      v-for="food in results.foods"
      :key="food.code"
      @click="emitFoodSelected(food.code)"
    >
      <v-list-item-content>
        <v-list-item-title>{{ food.description }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-item-group>
</template>

<script lang="ts">
import type { PropType } from '@vue/composition-api';
import { defineComponent } from '@vue/composition-api';
import type { FoodSearchResponse } from '@intake24/common/types/http';

export default defineComponent({
  name: 'FoodSearchResults',

  props: {
    results: {
      type: Object as PropType<FoodSearchResponse>,
      required: true,
    },
  },

  methods: {
    emitFoodSelected(foodCode: string): void {
      this.$emit('food-selected', foodCode);
    },
  },
});
</script>
