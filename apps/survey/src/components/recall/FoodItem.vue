<template>
  <v-list v-if="foods.length > 0">
    <v-list-item v-for="(food, i) in foods" :key="i" link>
      <v-list-item-title class="text-wrap" @click="selectFood(i)">
        {{ foodDisplayName(food) }}
      </v-list-item-title>
      <v-list-item-action>
        <v-icon x-small v-if="food.code" color="green darken-2">fa-check</v-icon>
      </v-list-item-action>
      <v-list-item-action>
        <v-icon x-small v-if="food.portionSizeMethod" color="green darken-2">fa-check</v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { FoodState } from '@intake24/common/types';

export default defineComponent({
  name: 'FoodItem',

  props: {
    // FIXME: Should be an array of objects of type UserFoodData or EncodedUserFoodData ???
    foods: Array as PropType<FoodState[]>,
  },

  data() {
    return {};
  },

  methods: {
    selectFood(foodIndex: number) {
      this.$emit('food-selected', foodIndex);
    },
    foodDisplayName(food: FoodState): string {
      if (food.type === 'free-text') return food.description;
      if (food.type === 'encoded-food') return food.data.localName;

      return '???';
    },
  },
});
</script>
