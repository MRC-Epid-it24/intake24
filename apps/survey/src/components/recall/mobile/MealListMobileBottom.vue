<template>
  <v-card flat>
    <v-toolbar flat dense>
      <v-tabs show-arrows icons-and-text center-active touch v-model="activeTab">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab
          v-for="(meal, idx) in meals"
          :key="idx + meal.name"
          @change="emitFoodsList(idx, meal.name, meal.foods, entity)"
        >
          {{ meal.name }}
          <v-icon x-small v-if="meal.time.length === 0">far fa-question-circle </v-icon>
          <p v-else>{{ meal.time }}</p>
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { FoodState } from '@intake24/common/types';

export default Vue.extend({
  // components: { MealItemMobile },
  name: 'MealListMobileBottom',

  props: {
    meals: Array,
    selectedMealIndex: Number,
  },

  data() {
    return {
      entity: 'meal',
      activeTab: this.selectedMealIndex + 1,
    };
  },

  methods: {
    emitFoodsList(mealIndex: number, name: string, foods: FoodState[], entity: string) {
      this.$emit('mealSelected', { mealIndex, name, foods, entity });
    },
    emitAddMeal(action: string) {
      this.$emit('recall-action', action);
    },
  },
});
</script>
//
<style lang="scss" scoped>
@import '../../../scss/meallistmobile.scss';
</style>
