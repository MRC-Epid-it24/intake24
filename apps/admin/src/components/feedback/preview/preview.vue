<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template #activator="{ attrs, on }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          class="ml-3"
          color="primary"
          :title="$t('feedback-schemes.preview.title')"
          v-on="on"
        >
          <v-icon left>$search</v-icon>
          {{ $t('feedback-schemes.preview._') }}
        </v-btn>
      </slot>
    </template>
    <v-card tile>
      <v-toolbar color="primary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('feedback-schemes.preview.title') }}</v-toolbar-title>
      </v-toolbar>
      <v-container class="pa-0" fluid>
        <h1 class="text-h1 font-weight-medium text-center">
          {{ $t('feedback.title') }}
        </h1>
        <div v-if="feedbackDicts" class="d-flex flex-column">
          <feedback-cards
            v-if="showCards"
            v-bind="{ cards }"
            :class="`feedback-area order-${getSectionOrder('cards')}`"
          ></feedback-cards>
          <v-sheet
            v-if="showTopFoods"
            :class="`order-${getSectionOrder('topFoods')}`"
            color="white"
          >
            <feedback-top-foods v-bind="{ topFoods }" class="feedback-area"></feedback-top-foods>
          </v-sheet>
          <feedback-meals
            v-if="showTopFoods"
            :class="`feedback-area order-${getSectionOrder('meals')}`"
            :config="feedbackScheme.meals"
            :nutrient-types="feedbackDicts.feedbackData.nutrientTypes"
            :submissions="submissions"
            :survey-stats="feedbackDicts.surveyStats"
          ></feedback-meals>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { feedbackService } from '@intake24/admin/services';
import {
  buildCardParams,
  buildTopFoods,
  FeedbackCards,
  FeedbackMeals,
  FeedbackTopFoods,
  useFeedback,
} from '@intake24/ui/feedback';

import * as previewData from './preview-data';

export type Submission = {
  id: string;
  number: number;
  endDate: string;
  endTime: string;
};

export default defineComponent({
  name: 'FeedbackPreview',

  components: { FeedbackCards, FeedbackMeals, FeedbackTopFoods },

  props: {
    feedbackScheme: {
      type: Object as PropType<FeedbackSchemeEntry>,
      required: true,
    },
  },

  setup(props) {
    const dialog = ref(false);

    const scheme = computed(() => props.feedbackScheme);

    const { cards, feedbackDicts, getSectionOrder, topFoods, showCards, showMeals, showTopFoods } =
      useFeedback(scheme);

    return {
      dialog,
      ...previewData,
      cards,
      feedbackDicts,
      getSectionOrder,
      topFoods,
      showCards,
      showMeals,
      showTopFoods,
    };
  },

  watch: {
    feedbackScheme: {
      async handler() {
        await this.buildFeedback();
      },
      deep: true,
    },
  },

  async mounted() {
    await this.buildFeedback();
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

      this.feedbackDicts = feedbackDicts;

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
      this.topFoods = buildTopFoods(topFoods, foods, nutrientTypes);
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
