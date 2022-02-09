<template>
  <v-card width="320px" height="100%">
    <v-img height="180px" :src="characterImageMap[parameters.characterType]"></v-img>
    <div v-for="(detail, idx) in details" :key="idx">
      <v-card-subtitle class="font-weight-medium">
        <i18n path="feedback.intake" tag="div" class="mb-2">
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
    </div>
    <v-btn block class="tell-me-more" @click.stop="open">Tell me more</v-btn>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-toolbar flat>
          <v-icon class="mr-3">fa-palette</v-icon>
          <v-toolbar-title> Title </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!-- <v-btn :title="$t('common.action.ok')" text @click.stop="close">
              <v-icon left>$success</v-icon>
            </v-btn> -->
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <div v-html="details[0].description"></div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api';
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

export default defineComponent({
  name: 'FeedbackCharacterCard',

  props: {
    parameters: {
      type: Object as PropType<CharacterParameters>,
      required: true,
    },
  },

  setup() {
    const dialog = ref(false);

    return {
      dialog,
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
  },

  methods: {
    open() {
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
