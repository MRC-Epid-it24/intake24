<template>
  <v-list v-if="foods.length > 0" :class="{ 'pa-0': linked }">
    <div v-for="(food, i) in foods" :key="i" :class="{ 'ml-4': linked }">
      <v-list-item class="ma-0 small" link>
        <v-list-item-title class="text-wrap" @click="emitFoodSelected(food.id)"
          ><span :class="{ 'linked-food-title': linked }"> {{ foodDisplayName(food) }}</span>
        </v-list-item-title>
        <v-list-item-action>
          <v-icon x-small v-if="food.code" color="green darken-2">fa-check</v-icon>
        </v-list-item-action>
        <v-list-item-action>
          <v-icon x-small v-if="food.portionSizeMethod" color="green darken-2">fa-check</v-icon>
        </v-list-item-action>
      </v-list-item>
      <food-item :foods="food.linkedFoods" @food-selected="onLinkedFoodSelected" linked></food-item>
    </div>
  </v-list>
</template>

<style>
.linked-food-title {
}
</style>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodState } from '@intake24/common/types';

export default defineComponent({
  name: 'FoodItem',

  props: {
    // FIXME: Should be an array of objects of type UserFoodData or EncodedUserFoodData ???
    foods: Array as PropType<FoodState[]>,

    linked: Boolean,
  },

  data() {
    return {};
  },

  methods: {
    onLinkedFoodSelected(foodId: number) {
      this.emitFoodSelected(foodId);
    },

    emitFoodSelected(foodId: number) {
      this.$emit('food-selected', foodId);
    },
    foodDisplayName(food: FoodState): string {
      if (food.type === 'free-text') return food.description;
      if (food.type === 'encoded-food') return food.data.localName;

      return '???';
    },
  },
});
</script>
