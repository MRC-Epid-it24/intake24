<template>
  <v-card width="320px" height="100%">
    <v-img height="180px" :src="backgroundImage"></v-img>
    <v-card-subtitle class="font-weight-medium">
      <i18n path="feedback.intake" tag="div" class="mb-2">
        <template v-slot:nutrient>
          <span>{{ details.name.toLowerCase() }}</span>
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
import { defineComponent, PropType } from '@vue/composition-api';
import { DemographicRange, FiveADayParameters } from '@intake24/survey/feedback';
import {
  getIconClass,
  getLocaleContent,
  getTextClass,
  getUnitFromNutrientRule,
  fiveADayImageMap,
  FeedbackDetails,
} from './card-utils';

export default defineComponent({
  name: 'FiveADayCard',

  props: {
    parameters: {
      type: Object as PropType<FiveADayParameters>,
      required: true,
    },
  },

  setup() {
    return {
      fiveADayImageMap,
      getIconClass,
      getLocaleContent,
      getTextClass,
      getUnitFromNutrientRule,
    };
  },

  computed: {
    details(): FeedbackDetails {
      const { name, description, low, high, unit, portions } = this.parameters;
      const sentiment = 'good';

      return {
        name: this.getLocaleContent<string>(name),
        description: this.getLocaleContent(description),
        intake: portions,
        targetIntake: new DemographicRange(high?.threshold ?? 5, high?.threshold ?? 5),
        unit: this.getLocaleContent<string>(unit.name),
        unitDescription: this.getLocaleContent(unit.description),
        sentiment,
        textClass: this.getTextClass(sentiment),
        iconClass: this.getIconClass(sentiment),
        warning: low && portions < low.threshold ? this.getLocaleContent(low.message) : undefined,
      };
    },

    backgroundImage(): string {
      return this.fiveADayImageMap.fruit_veg;
    },
  },
});
</script>

<style lang="scss" scoped></style>
