<template>
  <v-card width="320px">
    <v-img height="180px" :src="backgroundImage"></v-img>
    <v-card-subtitle class="font-weight-medium">
      <div class="mb-2">
        {{ details.name }}
        <span>{{ details.intake }} {{ details.unit }}.</span>
      </div>
      <div :class="details.textClass">
        <v-icon left>{{ details.iconClass }}</v-icon>
        <span>{{ details.targetIntake.toString() }} {{ details.unit }}</span>
      </div>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import { round } from '@intake24/common/util';
import { Sentiment } from '@intake24/common/feedback';
import { DemographicRange, NutrientGroupParameters } from '@intake24/survey/feedback';
import { defineComponent } from '@vue/composition-api';
import {
  getIconClass,
  getTextClass,
  getUnitFromNutrientRule,
  nutrientGroupImageMap,
  FeedbackDetails,
} from './card-utils';

export default defineComponent({
  name: 'NutrientGroupCard',

  props: {
    parameters: {
      type: Object as () => NutrientGroupParameters,
      required: true,
    },
  },

  data() {
    return { nutrientGroupImageMap };
  },

  setup() {
    return { getIconClass, getTextClass, getUnitFromNutrientRule };
  },

  computed: {
    details(): FeedbackDetails {
      const { name, intake, targetIntake, low, high, description } = this.parameters;
      const sentiment = Sentiment.GOOD;

      let warning;

      if (low && intake < low.threshold) warning = low.message;
      else if (high && intake > high.threshold) warning = high.message;

      return {
        name,
        description,
        intake: round(intake),
        targetIntake: new DemographicRange(round(targetIntake.start), round(targetIntake.end)),
        unit: 'g',
        unitDescription: '',
        sentiment,
        textClass: this.getTextClass(sentiment),
        iconClass: this.getIconClass(sentiment),
        warning,
      };
    },

    backgroundImage(): string {
      for (const nutrientTypeId of this.parameters.nutrients) {
        if (nutrientTypeId in this.nutrientGroupImageMap)
          return this.nutrientGroupImageMap[nutrientTypeId];
      }

      return '';
    },
  },
});
</script>

<style lang="scss" scoped></style>
