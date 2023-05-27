<template>
  <v-card class="meal-list-mobile" flat tile>
    <v-toolbar bottom class="sticky_toolbar" flat>
      <v-tabs center-active height="56px" icons-and-text slider-size="4" touch :value="activeTab">
        <v-tabs-slider color="secondary"></v-tabs-slider>
        <v-tab v-for="meal in meals" :key="meal.id" @click="mealSelected(meal.id)">
          <v-badge
            bordered
            color="grey"
            :content="meal.foods.length"
            left
            :value="!!meal.foods.length"
          >
            <p v-if="mealTimeString(meal.time).length === 0">
              <v-icon x-small>$question</v-icon>
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
import { useLocale } from '@intake24/survey/composables';
import { useSurvey } from '@intake24/survey/stores';
import { getMealIndex } from '@intake24/survey/util';
import { fromMealTime } from '@intake24/ui/util';

export default defineComponent({
  name: 'MealListMobile',

  emits: ['meal-selected'],

  setup() {
    const { getLocaleContent } = useLocale();

    return { getLocaleContent };
  },

  computed: {
    ...mapState(useSurvey, ['meals', 'selectedMealOptional']),

    activeTab() {
      if (this.selectedMealOptional === undefined) return 0;
      return getMealIndex(this.meals, this.selectedMealOptional.id) ?? 0;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['setSelection']),

    mealSelected(mealId: string) {
      this.setSelection({ element: { type: 'meal', mealId }, mode: 'manual' });
      this.$emit('meal-selected', mealId);
    },

    mealTimeString(time: MealTime | undefined): string {
      return time ? fromMealTime(time) : '';
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../scss/meallistmobile.scss';
</style>
