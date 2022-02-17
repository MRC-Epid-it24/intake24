<template>
  <v-card width="320px" height="100%">
    <v-img height="180px" :src="backgroundImage"></v-img>
    <div v-for="(detail, idx) in details" :key="idx">
      <v-card-subtitle class="font-weight-medium">
        <i18n path="feedback.intake.your" tag="div" class="mb-2">
          <template v-slot:nutrient>
            <span>{{ detail.name.toLowerCase() }}</span>
          </template>
          <template v-slot:amount>
            <span :class="detail.textClass">{{ detail.intake }} {{ detail.unit }}</span>
          </template>
        </i18n>
        <div>
          <v-icon left>{{ detail.iconClass }}</v-icon>
          <span>{{ detail.targetIntake.toString() }} {{ detail.unit }}</span>
        </div>
      </v-card-subtitle>
      <tell-me-more v-bind="{ detail }"></tell-me-more>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { round } from '@intake24/common/util';
import { CharacterParameters, DemographicRange } from '@intake24/survey/feedback';
import {
  getIconClass,
  getLocaleContent,
  getTextClass,
  getUnitFromNutrientRule,
  characterImageMap,
  FeedbackDetails,
} from './card-utils';
import TellMeMore from './tell-me-more.vue';

export default defineComponent({
  name: 'FeedbackCharacterCard',

  components: { TellMeMore },

  props: {
    parameters: {
      type: Object as PropType<CharacterParameters>,
      required: true,
    },
  },

  setup() {
    return {
      characterImageMap,
      getIconClass,
      getLocaleContent,
      getTextClass,
      getUnitFromNutrientRule,
    };
  },

  computed: {
    details(): FeedbackDetails[] {
      return this.parameters.results.map((result) => {
        const {
          consumption: intake,
          resultedDemographicGroup: { nutrientRuleType, nutrient, scaleSectors },
        } = result;

        const { name, description, sentiment, range } = scaleSectors[0];

        return {
          name: this.getLocaleContent<string>(name),
          description: this.getLocaleContent(description),
          intake: round(intake),
          targetIntake: new DemographicRange(round(range.start), round(range.end)),
          unit: this.getUnitFromNutrientRule(nutrientRuleType, nutrient.unit),
          unitDescription: this.$t(`feedback.unitDescription.${nutrientRuleType}`).toString(),
          sentiment,
          textClass: this.getTextClass(sentiment),
          iconClass: this.getIconClass(sentiment),
        };
      });
    },

    backgroundImage(): string {
      return this.characterImageMap[this.parameters.characterType];
    },
  },
});
</script>

<style lang="scss" scoped></style>
