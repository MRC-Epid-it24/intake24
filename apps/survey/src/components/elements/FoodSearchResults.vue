<template>
  <v-list-item-group>
    <v-list-item
      v-for="food in results.foods"
      :key="food.code"
      class="list-item-border"
      @click="foodSelected(food)"
    >
      <v-list-item-content>
        <v-list-item-title>{{ food.description }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-item-group>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodHeader, FoodSearchResponse } from '@intake24/common/types/http';

export default defineComponent({
  name: 'FoodSearchResults',

  props: {
    results: {
      type: Object as PropType<FoodSearchResponse>,
      required: true,
    },
  },

  emits: ['food-selected'],

  methods: {
    foodSelected(food: FoodHeader): void {
      this.$emit('food-selected', food);
    },
  },
});
</script>
