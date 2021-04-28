<template>
  <v-list v-if="foods.length > 0">
    <v-list-item v-for="(food, i) in foods" :key="i" link>
      <v-list-item-title
        v-text="foodDisplayName(food)"
        @click="chooseFood(food.name)"
      ></v-list-item-title>
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
import Vue, { VueConstructor } from 'vue';
import { FoodState } from '@common/types';

function foodDisplayName(food: FoodState): string {
  if (food.type === 'free-text') return food.description;
  if (food.type === 'encoded-food') return food.data.localDescription;

  return '???';
}

export default (Vue as VueConstructor<Vue>).extend({
  name: 'FoodItem',
  props: {
    // FIXME: Should be an array of objects of type UserFoodData or EncodedUserFoodData ???
    foods: Array as () => FoodState[],
  },
  data() {
    return {};
  },
  methods: {
    chooseFood(foodName: string) {
      this.$emit('breadcrumbFood', foodName);
    },
    foodDisplayName(food: FoodState): string {
      if (food.type === 'free-text') return food.description;
      if (food.type === 'encoded-food') return food.data.localDescription;

      return '???';
    },
  },
});
</script>
