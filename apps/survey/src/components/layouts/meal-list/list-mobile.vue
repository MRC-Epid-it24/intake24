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
            <p v-if="meal.time">{{ getMealTime(meal) }}</p>
            <p v-else>
              <v-icon x-small>$question</v-icon>
            </p>
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

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import { useLocale, useMealUtils } from '@intake24/survey/composables';
import { useSurvey } from '@intake24/survey/stores';
import { getMealIndex } from '@intake24/survey/util';

export default defineComponent({
  name: 'MealListMobile',

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  emits: ['action'],

  setup() {
    const { getLocaleContent } = useLocale();
    const { getMealTime } = useMealUtils();

    return { getLocaleContent, getMealTime };
  },

  computed: {
    ...mapState(useSurvey, ['selectedMealOptional']),

    activeTab() {
      if (this.selectedMealOptional === undefined) return 0;
      return getMealIndex(this.meals, this.selectedMealOptional.id) ?? 0;
    },
  },

  methods: {
    mealSelected(mealId: string) {
      this.action('selectMeal', mealId);
    },

    action(type: FoodActionType | MealActionType, id?: string) {
      this.$emit('action', type, id);
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../../scss/meallistmobile.scss';
</style>
