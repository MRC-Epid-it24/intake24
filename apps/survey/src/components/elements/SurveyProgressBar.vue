<template>
  <v-item-group>
    <v-row dense justify-center style="flex-wrap: nowrap">
      <v-col v-for="(item, idx) in meals" :key="idx" class="flex-grow-1 text-center justify-center">
        <v-item>
          <v-card
            class="d-flex align-center text-center justify-center"
            :color="color(item)"
            dense
            flat
            height="1.2rem"
            width="100%"
          >
            <span :class="item.time ? 'primary--text' : 'secondary--text'">{{
              stringTime(item.time)
            }}</span>
          </v-card>
        </v-item>
        <span class="text-caption">{{ item.name[$i18n.locale] ?? item.name.en }}</span>
      </v-col>
    </v-row>
  </v-item-group>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState, MealTime } from '@intake24/common/types';
import { fromMealTime } from '@intake24/survey/stores/meal-food-utils';

export default defineComponent({
  name: 'SurveyProgressBar',

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  setup() {
    const stringTime = (time: MealTime | undefined): string => {
      if (time === undefined) return '?';
      return fromMealTime(time, true);
    };
    const color = (item: MealState) => {
      if (!item.time) return 'primary';
      if (item.foods.length === 0) return 'secondary';
      //   const finishedRecall = item.foods.reduce();
      return 'success';
    };
    return { color, stringTime };
  },
});
</script>

<style lang="scss" scoped></style>
