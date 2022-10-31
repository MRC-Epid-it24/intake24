<template>
  <v-card class="sticky_toolbar_card" flat>
    <v-toolbar bottom class="sticky_toolbar" flat>
      <v-tabs
        ref="tabsComponent"
        center-active
        height="56px"
        icons-and-text
        slider-size="4"
        touch
        :value="activeTab"
      >
        <v-tabs-slider color="success"></v-tabs-slider>
        <v-tab v-for="(meal, index) in meals" :key="index" @click="onMealSelected(meal.id)">
          <v-badge
            bordered
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
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { MealTime } from '@intake24/common/types';
import { localeContent, timeDoubleDigitsConvertor } from '@intake24/survey/components/mixins';
import { useSurvey } from '@intake24/survey/stores';
import { getMealIndex } from '@intake24/survey/stores/meal-food-utils';

export default defineComponent({
  // components: { MealItemMobile },
  name: 'MealListMobileBottom',

  mixins: [localeContent],

  computed: {
    ...mapState(useSurvey, ['meals', 'selectedMealOptional']),

    activeTab() {
      if (this.selectedMealOptional === undefined) return 0;
      const selectedMealIndex = getMealIndex(this.meals, this.selectedMealOptional.id);
      return selectedMealIndex ?? 0;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['setSelection']),

    onMealSelected(mealId: number) {
      this.setSelection({
        element: {
          type: 'meal',
          mealId,
        },
        mode: 'manual',
      });
      this.$emit('meal-selected', mealId);
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
