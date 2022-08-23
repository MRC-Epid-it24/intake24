<template>
  <v-card class="sticky_toolbar_card" flat>
    <v-toolbar bottom class="sticky_toolbar" flat>
      <v-tabs v-model="activeTab" center-active height="56px" icons-and-text slider-size="4" touch>
        <v-tabs-slider color="success"></v-tabs-slider>
        <v-tab
          v-for="(meal, idx) in meals"
          :key="meal.id"
          @click="emitFoodsList(idx, meal.name.en, meal.foods, entity)"
        >
          <v-badge
            bordered
            class="meail_badge"
            color="grey"
            :content="meal.foods.length"
            left
            :value="meal.foods.length > 0"
          >
            <p v-if="mealTimeString(meal.time).length === 0">
              <v-icon x-small>far fa-question-circle </v-icon>
            </p>
            <p v-else>{{ mealTimeString(meal.time) }}</p>
            {{ getLocaleContent(meal.name) }}
          </v-badge>
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { FoodState, MealState, MealTime } from '@intake24/common/types';
import { localeContent, timeDoubleDigitsConvertor } from '@intake24/survey/components/mixins';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  // components: { MealItemMobile },
  name: 'MealListMobileBottom',

  mixins: [localeContent],

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
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
    ...mapState(useSurvey, ['selectedMealOptional', 'selectedFoodOptional']),

    activeTab: {
      get(): number {
        return this.selectedMealOptional?.id || 0;
      },
      set(id: number) {
        return id;
      },
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

  methods: {
    emitFoodsList(mealIndex: number, name: string, foods: FoodState[], entity: string) {
      this.$emit('meal-selected', { mealIndex, name, foods, entity });
    },
    emitAddMeal(action: string) {
      this.$emit('recall-action', action);
    },

    mealTimeString(time: MealTime | undefined): string {
      return time
        ? timeDoubleDigitsConvertor(time.hours)
            .concat(':')
            .concat(timeDoubleDigitsConvertor(time.minutes))
        : '';
    },
  },
});
</script>
//
<style lang="scss" scoped>
@import '../../../scss/meallistmobile.scss';
</style>
