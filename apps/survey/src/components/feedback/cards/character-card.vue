<template>
  <v-card width="320px">
    <v-img height="180px" :src="characterImageMap[parameters.type]"></v-img>
    <div v-for="(detail, idx) in details" :key="idx">
      <v-card-subtitle class="font-weight-medium">
        <div class="mb-2">
          {{ detail.name.en }}
          <span :class="detail.textClass">{{ detail.intake }}{{ detail.unit }}</span
          >.
        </div>
        <div>
          <v-icon left>{{ detail.iconClass }}</v-icon>
          <span> {{ detail.targetIntake.toString() }} {{ detail.unit }} </span>
        </div>
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script lang="ts">
import { round } from '@intake24/common/util';
import { CharacterParameters, DemographicRange } from '@intake24/survey/feedback';
import { defineComponent } from '@vue/composition-api';
import {
  getIconClass,
  getTextClass,
  getUnitFromNutrientRule,
  characterImageMap,
  FeedbackDetails,
} from './card-utils';

export default defineComponent({
  name: 'FeedbackCharacterCard',

  props: {
    parameters: {
      type: Object as () => CharacterParameters,
      required: true,
    },
  },

  data() {
    return {
      characterImageMap,
    };
  },

  setup() {
    return { getIconClass, getTextClass, getUnitFromNutrientRule };
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
          name: { en: name ?? '' },
          description: { en: description ?? '' },
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
  },
});
</script>

<style lang="scss" scoped></style>
