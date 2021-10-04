<template>
  <v-card flat>
    <v-toolbar flat dense>
      <v-tabs icons-and-text center-active show-arrows touch v-model="active_tab">
        <v-tabs-slider></v-tabs-slider>
        <v-tab class="add_button" @click="emitAddMeal('add-meal')">
          <span>MEAL</span>
          <span>ADD</span>
        </v-tab>
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
import Vue, { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';
import { FoodState } from '@common/types';

export default (Vue as VueConstructor<Vue>).extend({
  // components: { MealItemMobile },
  name: 'MealListMobileBottom',

  props: {
    meals: Array,
  },
  data() {
    return {
      entity: 'meal',
    };
  },

  computed: {
    ...mapGetters('survey', ['selectedMealIndex']),

    active_tab: {
      get() {
        return this.selectedMealIndex + 1;
      },

      set(id: number) {
        return id;
      },
    },
  },

  methods: {
    emitFoodsList(mealIndex: number, name: string, foods: FoodState[], entity: string) {
      this.$emit('displayMealContext', { mealIndex, name, foods, entity });
      this.active_tab = mealIndex + 1;
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
