<template>
  <v-card flat>
    <v-toolbar flat dense>
      <v-tabs show-arrows icons-and-text center-active touch v-model="activeTab">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab
          v-for="(meal, idx) in meals"
          :key="idx + meal.name"
          @click="emitFoodsList(idx, meal.name, meal.foods, entity)"
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
import { defineComponent } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { FoodState } from '@intake24/common/types';

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
