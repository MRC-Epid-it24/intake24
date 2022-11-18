<template>
  <v-card flat :loading="loading">
    <v-toolbar dense flat>
      <v-tabs v-model="active_tab" center-active icons-and-text show-arrows touch>
        <v-tab class="add_button" @click="action('editMeal')">
          <span>FOOD</span>
          <span>ADD</span>
        </v-tab>
        <v-tab
          v-for="(food, i) in mealfoods"
          :key="i"
          @click="selectedFood(i, mealIndex, foodDisplayName(food), entity)"
        >
          {{ foodDisplayName(food) }}
          <v-icon v-if="food.code" color="green darken-2" x-small>fa-check</v-icon>
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { FoodState } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'FoodListMobileBottom',

  props: {
    // FIXME: Should be an array of objects of type UserFoodData or EncodedUserFoodData ???
    foods: {
      type: Array as PropType<FoodState[]>,
      default: () => [],
    },
    loading: Boolean,
    mealIndex: Number || undefined,
  },
  data() {
    return {
      entity: 'food',
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedFoodIndex']),

    mealfoods(): FoodState[] {
      return this.foods;
    },

    active_tab: {
      get(): number {
        return this.selectedFoodIndex || 0 + 1;
      },

      set(id: number) {
        return id;
      },
    },
  },

  methods: {
    selectedFood(foodIndex: number, mealIndex: number | undefined, name: string, entity: string) {
      if (mealIndex !== undefined)
        this.$emit('displayFoodContext', { foodIndex, mealIndex, name, entity });
      this.active_tab = foodIndex + 1;
    },
    foodDisplayName(food: FoodState): string {
      let dispalyName = '???';
      if (food.type === 'free-text') dispalyName = food.description;
      if (food.type === 'encoded-food') dispalyName = food.data.localName;
      if (dispalyName.length > 16) dispalyName = dispalyName.slice(0, 16).concat('...');
      return dispalyName;
    },
    action(type: string) {
      this.$emit('meal-action', { mealIndex: this.$props.mealIndex, type });
    },
  },
});
</script>
<style lang="scss" scoped>
@import '../../../scss/meallistmobile.scss';
</style>
