<template>
  <div class="survey-progress">
    <v-chip-group>
      <div v-for="(item, idx) in meals" :key="idx" class="d-flex flex-column justify-start">
        <v-chip
          class="font-weight-medium"
          :color="color(item)"
          label
          :text-color="item.time ? 'white' : 'secondary'"
        >
          {{ stringTime(item.time) }}
        </v-chip>
        <span class="text-caption">{{ getLocaleContent(item.name) }}</span>
      </div>
    </v-chip-group>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState, MealTime } from '@intake24/common/types';
import { useLocale } from '@intake24/survey/composables';
import { fromMealTime } from '@intake24/ui/util';

export default defineComponent({
  name: 'SurveyProgressBar',

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  setup() {
    const { getLocaleContent } = useLocale();

    const stringTime = (time: MealTime | undefined): string => {
      if (time === undefined) return '?';
      return fromMealTime(time);
    };

    const color = (item: MealState) => {
      if (!item.time) return 'primary';
      if (item.foods.length === 0) return 'secondary';
      //   const finishedRecall = item.foods.reduce();
      return 'success';
    };

    return { color, stringTime, getLocaleContent };
  },
});
</script>

<style lang="scss">
.survey-progress {
  .v-chip-group .v-chip {
    display: block;
    margin: 4px 2px 4px 0;
    padding: 0 4px;
  }

  .v-slide-group__content {
    flex-shrink: 1;
    white-space: initial;
  }
}
</style>
