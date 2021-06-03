<template>
  <v-card elevation="5" :loading="loading">
    <v-toolbar dense>
      <v-tabs center-active touch show-arrows icons-and-text>
        <v-tab class="add_food"> ADD </v-tab>
        <v-tab v-for="(food, i) in mealfoods" :key="i" @click="selectedFood(i)">
          {{ foodDisplayName(food) }}
          <v-icon x-small v-if="food.code" color="green darken-2">fa-check</v-icon>
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { FoodState } from '@common/types';

export default (Vue as VueConstructor<Vue>).extend({
  // components: { MealItemMobile },
  name: 'MealListMobileBottom',

  props: {
    // FIXME: Should be an array of objects of type UserFoodData or EncodedUserFoodData ???
    foods: Array as () => FoodState[],
    loading: Boolean,
  },
  data() {
    return {
      offset: true,
    };
  },
  methods: {
    selectFood(foodIndex: number) {
      this.$emit('food-selected', foodIndex);
    },
    foodDisplayName(food: FoodState): string {
      if (food.type === 'free-text') return food.description;
      if (food.type === 'encoded-food') return food.data.localDescription;

      return '???';
    },
  },
  computed: {
    mealfoods() {
      return this.foods;
    },
  },
});
</script>
<style lang="scss" scoped>
@import '../../scss/meallistmobile2.scss';
</style>
