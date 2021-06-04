<template>
  <v-card elevation="5" :loading="loading">
    <v-toolbar dense>
      <v-tabs center-active touch show-arrows icons-and-text>
        <v-tab class="add_food" @click="onAddFood('edit-foods')"> ADD </v-tab>
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
    mealIndex: Number || undefined,
  },
  data() {
    return {
      offset: true,
    };
  },
  methods: {
    selectedFood(foodIndex: number) {
      console.log(`Selected Food: ${foodIndex}`);
      this.$emit('food-selected', foodIndex);
    },
    foodDisplayName(food: FoodState): string {
      let dispalyName = '???';
      if (food.type === 'free-text') dispalyName = food.description;
      if (food.type === 'encoded-food') dispalyName = food.data.localDescription;
      if (dispalyName.length > 16) dispalyName = dispalyName.slice(0, 16).concat('...');
      return dispalyName;
    },
    onAddFood(action: string) {
      this.$emit('meal-action', {
        mealIndex: this.$props.mealIndex,
        action,
      });
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
