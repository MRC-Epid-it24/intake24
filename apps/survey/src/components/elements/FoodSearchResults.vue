<template>
  <v-list-item-group>
    <v-list-item v-for="food in results.foods" :key="food.code" @click="selectFood(food.code)">
      <v-list-item-content>
        <v-list-item-title>{{ food.description }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-item-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FoodSearchResponse } from '@intake24/common/types/http';

export default Vue.extend({
  name: 'FoodSearchResults',
  props: {
    results: {
      type: Object as () => FoodSearchResponse,
      required: true,
    },
  },
  methods: {
    selectFood(foodCode: string): void {
      this.$emit('food-selected', foodCode);
    },
  },
});
</script>
