<template>
  <v-card class="sticky_toolbar_card" flat tile>
    <v-toolbar bottom class="sticky_toolbar" flat>
      <v-tabs center-active height="56px" icons-and-text slider-size="4" touch :value="activeTab">
        <v-tabs-slider color="success"></v-tabs-slider>
        <v-tab v-for="(meal, index) in meals" :key="index" @click="mealSelected(meal.id)">
          <v-badge
            bordered
            color="grey"
            :content="meal.foods.length"
            left
            :value="!!meal.foods.length"
          >
            <p v-if="mealTimeString(meal.time).length === 0">
              <v-icon x-small>far fa-question-circle</v-icon>
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
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { MealTime } from '@intake24/common/types';
import { localeContent } from '@intake24/survey/components/mixins';
import { useSurvey } from '@intake24/survey/stores';
import { fromMealTime, getMealIndex } from '@intake24/survey/stores/meal-food-utils';

export default defineComponent({
  name: 'MealListMobileBottom',

  mixins: [localeContent],

  computed: {
    ...mapState(useSurvey, ['meals', 'selectedMealOptional']),

    activeTab() {
      if (this.selectedMealOptional === undefined) return 0;
      return getMealIndex(this.meals, this.selectedMealOptional.id) ?? 0;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['setSelection']),

    mealSelected(mealId: number) {
      this.setSelection({ element: { type: 'meal', mealId }, mode: 'manual' });
      this.$emit('meal-selected', mealId);
    },

    mealTimeString(time: MealTime | undefined): string {
      return time ? fromMealTime(time, true) : '';
    },
  },
});
</script>
//
<style lang="scss" scoped>
@import '../../../scss/meallistmobile.scss';
</style>
