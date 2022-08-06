<template>
  <v-card flat class="sticky_toolbar_card">
    <v-toolbar flat bottom class="sticky_toolbar">
      <v-tabs slider-size="4" icons-and-text center-active touch v-model="activeTab" height="56px">
        <v-tabs-slider color="success"></v-tabs-slider>
        <v-tab
          v-for="(meal, idx) in meals"
          :key="idx + meal.name"
          @click="emitFoodsList(idx, meal.name, meal.foods, entity)"
        >
          <v-badge
            class="meail_badge"
            color="grey"
            :content="meal.foods.length"
            :value="meal.foods.length > 0"
            left
            bordered
          >
            <p v-if="meal.time.length === 0"><v-icon x-small>far fa-question-circle </v-icon></p>
            <p v-else>{{ meal.time }}</p>
            {{ meal.name }}
          </v-badge>
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { FoodState } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  // components: { MealItemMobile },
  name: 'MealListMobileBottom',

  props: {
    meals: Array,
    // selectedMealIndex: {
    //   type: Number,
    //   default: 0,
    // },
  },

  data() {
    return {
      entity: 'meal',
      // activeTab: this.selectedMealIndex,
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedMealIndex', 'selectedFoodIndex']),

    activeTab: {
      get(): number {
        return this.selectedMealIndex || 0;
      },
      set(id: number) {
        return id;
      },
    },
  },

  methods: {
    emitFoodsList(mealIndex: number, name: string, foods: FoodState[], entity: string) {
      this.$emit('meal-selected', { mealIndex, name, foods, entity });
    },
    emitAddMeal(action: string) {
      this.$emit('recall-action', action);
    },
  },
  watch: {
    selectedMealIndex: {
      handler(value: number) {
        console.log('Meal Index changed', value);
        this.activeTab = value;
      },
    },
  },
});
</script>
//
<style lang="scss" scoped>
@import '../../../scss/meallistmobile.scss';
</style>
