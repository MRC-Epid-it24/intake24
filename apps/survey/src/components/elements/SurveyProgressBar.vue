<template>
  <v-item-group>
    <v-row justify-center dense style="flex-wrap: nowrap">
      <v-col
        v-for="(item, idx) in store.meals"
        :key="idx"
        class="flex-grow-1 text-center justify-center"
      >
        <v-item>
          <v-card
            flat
            dense
            class="d-flex align-center text-center justify-center"
            :color="color(item)"
            height="1.2rem"
            width="100%"
          >
            <span :class="item.time ? 'primary--text' : 'secondary--text'">{{
              stringTime(item.time)
            }}</span>
          </v-card>
        </v-item>
        {{
          item.localName[$i18n.locale]
            .match(/\b(\w)/g)
            .join('')
            .toUpperCase()
        }}
      </v-col>
    </v-row>
  </v-item-group>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useSurvey } from '@intake24/survey/stores';
import { MealState, MealTime } from '@intake24/common/types';
import timeDoubleDigitsConvertor from '@intake24/survey/components/mixins/timeDoubleDigitsConvertor';

export default defineComponent({
  name: 'SurveyProgressBar',

  setup() {
    const store = useSurvey();
    const stringTime = (time: MealTime | undefined): string => {
      if (time === undefined) return '?';
      return timeDoubleDigitsConvertor(time.hours)
        .concat(':')
        .concat(timeDoubleDigitsConvertor(time.minutes));
    };
    const color = (item: MealState) => {
      if (!item.time) return 'primary';
      if (item.foods.length === 0) return 'secondary';
      //   const finishedRecall = item.foods.reduce();
      return 'success';
    };
    return { store, color, stringTime };
  },
});
</script>

<style lang="scss" scoped></style>
