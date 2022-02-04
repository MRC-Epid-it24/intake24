<template>
  <v-card width="320px">
    <v-img height="180px" :src="backgroundImage"></v-img>
    <v-card-subtitle class="font-weight-medium">
      <i18n path="feedback.intake" tag="div" class="mb-2">
        <template v-slot:nutrient>
          <span>{{ details.name.en.toLowerCase() }}</span>
        </template>
        <template v-slot:amount>
          <span>{{ details.intake }} {{ details.unit }}</span>
        </template>
      </i18n>
      <div :class="details.textClass">
        <v-icon left>{{ details.iconClass }}</v-icon>
        <span>{{ details.targetIntake.toString() }} {{ details.unit }}</span>
      </div>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Sentiment } from '@intake24/common/feedback';
import { DemographicRange, FiveADayParameters } from '@intake24/survey/feedback';
import {
  getIconClass,
  getTextClass,
  getUnitFromNutrientRule,
  fiveADayImageMap,
  FeedbackDetails,
} from './card-utils';

export default defineComponent({
  name: 'FiveADayCard',

  props: {
    parameters: {
      type: Object as () => FiveADayParameters,
      required: true,
    },
  },

  data() {
    return { fiveADayImageMap };
  },

  setup() {
    return { getIconClass, getTextClass, getUnitFromNutrientRule };
  },

  computed: {
    details(): FeedbackDetails {
      const { name, description, low, high, portions } = this.parameters;
      const sentiment = Sentiment.GOOD;

      return {
        name,
        description,
        intake: portions,
        targetIntake: new DemographicRange(high?.threshold ?? 5, high?.threshold ?? 5),
        unit: 'portions',
        unitDescription:
          'Number of portions is calculated based on your fruit and vegetable intake as explained below.',
        sentiment,
        textClass: this.getTextClass(sentiment),
        iconClass: this.getIconClass(sentiment),
        warning: low && portions < low.threshold ? low.message : undefined,
      };
    },

    backgroundImage(): string {
      return this.fiveADayImageMap.fruit_veg;
    },
  },
});
</script>

<style lang="scss" scoped></style>
