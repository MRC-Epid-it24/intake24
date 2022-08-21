<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          class="ml-3"
          color="primary"
          :title="$t('feedback-schemes.preview.title')"
          v-on="on"
        >
          <v-icon left>fas fa-magnifying-glass</v-icon>
          {{ $t('feedback-schemes.preview._') }}
        </v-btn>
      </slot>
    </template>
    <v-card tile>
      <v-toolbar dark color="primary">
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('feedback-schemes.preview.title') }}</v-toolbar-title>
      </v-toolbar>
      <v-container class="pa-0" fluid>
        <h1 class="text-h1 font-weight-medium text-center">
          {{ $t('feedback.title') }}
        </h1>
        <feedback-card-area v-bind="{ cards }" class="feedback-area"></feedback-card-area>
        <feedback-chart-area v-bind="{ topFoods }" class="feedback-area"></feedback-chart-area>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import type { FeedbackCardParameters } from '@intake24/ui/feedback';
import { feedbackService } from '@intake24/admin/services';
import { FeedbackCardArea, FeedbackChartArea } from '@intake24/ui/components/feedback';
import { buildCardParams, buildTopFoods } from '@intake24/ui/feedback';

import * as previewData from './preview-data';

export type Submission = {
  id: string;
  number: number;
  endDate: string;
  endTime: string;
};

export default defineComponent({
  name: 'FeedbackPreview',

  components: { FeedbackCardArea, FeedbackChartArea },

  props: {
    feedbackScheme: {
      type: Object as PropType<FeedbackSchemeEntry>,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
      ...previewData,

      cards: [] as FeedbackCardParameters[],
      topFoods: buildTopFoods({ max: 0, colors: [], nutrientTypes: [] }, [], [], this.$i18n.locale),
    };
  },

  watch: {
    feedbackScheme: {
      handler() {
        this.buildFeedback();
      },
      deep: true,
    },
  },

  async mounted() {
    this.buildFeedback();
  },

  methods: {
    async buildFeedback() {
      const {
        feedbackScheme: { cards, demographicGroups: groups, henryCoefficients, topFoods },
        physicalData,
        submissions,
      } = this;

      const { feedbackDicts, userDemographic } = await feedbackService.getFeedbackResults({
        cards,
        groups,
        henryCoefficients,
        physicalData,
        submissions,
      });

      if (!feedbackDicts || !userDemographic) return;

      const {
        surveyStats,
        feedbackData: { nutrientTypes },
      } = feedbackDicts;

      const selected = submissions.map(({ id }) => id);

      const foods = surveyStats.getReducedFoods(selected);
      const averageIntake = surveyStats.getAverageIntake(selected);
      const fruitAndVegPortions = surveyStats.getFruitAndVegPortions(selected);

      this.cards = buildCardParams(feedbackDicts.cards, {
        foods,
        userDemographic,
        averageIntake,
        fruitAndVegPortions,
      });
      this.topFoods = buildTopFoods(topFoods, foods, nutrientTypes, this.$i18n.locale);
    },

    close() {
      this.dialog = false;
    },
  },
});
</script>

<style lang="scss">
.feedback-area {
  padding: 16px 0 !important;

  @media print {
    padding: 0 !important;
  }
}
</style>
