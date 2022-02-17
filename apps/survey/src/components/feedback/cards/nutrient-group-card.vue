<template>
  <v-card width="320px" height="100%">
    <v-img height="180px" :src="backgroundImage"></v-img>
    <v-card-subtitle class="font-weight-medium">
      <i18n path="feedback.intake.your" tag="div" class="mb-2">
        <template v-slot:nutrient>
          <span>{{ detail.name.toLowerCase() }}</span>
        </template>
        <template v-slot:amount>
          <span>{{ detail.intake }} {{ detail.unit }}</span>
        </template>
      </i18n>
      <div :class="detail.textClass">
        <v-icon left>{{ detail.iconClass }}</v-icon>
        <span>{{ detail.targetIntake.toString() }} {{ detail.unit }}</span>
      </div>
    </v-card-subtitle>
    <tell-me-more v-bind="{ detail }"></tell-me-more>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { round } from '@intake24/common/util';
import { DemographicRange, NutrientGroupParameters } from '@intake24/survey/feedback';
import {
  getIconClass,
  getLocaleContent,
  getTextClass,
  getUnitFromNutrientRule,
  nutrientGroupImageMap,
  FeedbackDetails,
} from './card-utils';
import TellMeMore from './tell-me-more.vue';

export default defineComponent({
  name: 'NutrientGroupCard',

  components: { TellMeMore },

  props: {
    parameters: {
      type: Object as PropType<NutrientGroupParameters>,
      required: true,
    },
  },

  setup() {
    return {
      nutrientGroupImageMap,
      getIconClass,
      getLocaleContent,
      getTextClass,
      getUnitFromNutrientRule,
    };
  },

  computed: {
    detail(): FeedbackDetails {
      const { name, description, low, high, unit, intake, targetIntake } = this.parameters;
      const sentiment = 'good';

      let warning;

      if (low && intake < low.threshold) warning = this.getLocaleContent(low.message);
      else if (high && intake > high.threshold) warning = this.getLocaleContent(high.message);

      return {
        name: this.getLocaleContent<string>(name),
        description: this.getLocaleContent(description),
        intake: round(intake),
        targetIntake: new DemographicRange(round(targetIntake.start), round(targetIntake.end)),
        unit: this.getLocaleContent<string>(unit.name),
        unitDescription: this.getLocaleContent(unit.description),
        sentiment,
        textClass: this.getTextClass(sentiment),
        iconClass: this.getIconClass(sentiment),
        warning,
      };
    },

    backgroundImage(): string {
      for (const nutrientTypeId of this.parameters.nutrientTypes) {
        if (nutrientTypeId in this.nutrientGroupImageMap)
          return this.nutrientGroupImageMap[nutrientTypeId];
      }

      return '';
    },
  },
});
</script>

<style lang="scss" scoped></style>
