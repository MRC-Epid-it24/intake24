<template>
  <v-container class="px-0" fluid>
    <v-row justify="center" no-gutters>
      <v-col v-if="userDemographic" cols="12" sm="9" md="8">
        <user-demographic-info :user-info="userDemographic"></user-demographic-info>
      </v-col>
      <v-col cols="12" class="mt-4">
        <!-- Submission day selector -->
      </v-col>
      <v-col cols="12" class="mt-4">
        <feedback-card-area v-bind="{ cards }"></feedback-card-area>
      </v-col>
      <v-col cols="12" class="mt-4">
        <feedback-chart-area v-bind="{ topFoods }"></feedback-chart-area>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { feedbackService, FeedbackDictionaries } from '@intake24/survey/services';
import {
  UserDemographic,
  getTopFoods,
  FeedbackCardParameters,
  buildCardParams,
} from '@intake24/survey/feedback';
import { FeedbackSchemeEntryResponse } from '@intake24/common/types/http';
import {
  FeedbackChartArea,
  FeedbackCardArea,
  UserDemographicInfo,
} from '@intake24/survey/components/feedback';
import { mapState } from 'pinia';
import { useLoading, useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'FeedbackHome',

  components: { FeedbackCardArea, FeedbackChartArea, UserDemographicInfo },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      feedbackDicts: null as FeedbackDictionaries | null,
      userDemographic: null as UserDemographic | null,

      cards: [] as FeedbackCardParameters[],
      topFoods: getTopFoods({ max: 0, colors: [], nutrientTypes: [] }, [], this.$i18n.locale),

      daysRecorded: undefined as number | undefined,
      currentDay: undefined as number | undefined,
    };
  },

  setup() {
    return { buildCardParams };
  },

  computed: {
    ...mapState(useSurvey, ['parameters']),
    feedbackScheme(): FeedbackSchemeEntryResponse | undefined {
      return this.parameters?.feedbackScheme;
    },
  },

  async mounted() {
    const { feedbackScheme, surveyId } = this;

    if (!feedbackScheme) {
      this.$router.push({ name: 'feedback-error', params: { surveyId } });
      return;
    }

    const loading = useLoading();
    loading.addItem('feedback-initial-load');

    try {
      const { cards, demographicGroups, henryCoefficients } = feedbackScheme;

      const feedbackDicts = await feedbackService.getFeedbackResults(
        surveyId,
        cards,
        demographicGroups
      );
      if (!feedbackDicts) throw Error('Feedback data could not be loaded');

      this.feedbackDicts = feedbackDicts;

      const {
        feedbackData: { physicalActivityLevels, weightTargets },
        physicalData,
      } = this.feedbackDicts;

      if (!physicalData) {
        this.$router.push({ name: 'feedback-physical-data', params: { surveyId } });
        return;
      }

      const physicalActivityLevel = physicalActivityLevels.find(
        ({ id }) => id === physicalData.physicalActivityLevelId
      );
      const weightTarget = weightTargets.find(({ id }) => id === physicalData.weightTarget);

      if (!physicalActivityLevel) throw new Error('Unknown physical activity level.');
      if (!weightTarget) throw new Error('Unknown weight target.');

      this.userDemographic = new UserDemographic(
        physicalData,
        physicalActivityLevel,
        weightTarget,
        henryCoefficients
      );

      this.buildView();
    } catch (err) {
      console.log(err);
      // await this.$store.dispatch('feedback/setError', err);
      this.$router.push({ name: 'feedback-error', params: { surveyId } });
    } finally {
      loading.removeItem('feedback-initial-load');
    }
  },

  methods: {
    buildView(day?: number): void {
      const { feedbackDicts, feedbackScheme, surveyId, userDemographic } = this;
      if (!feedbackDicts || !feedbackScheme || !userDemographic) {
        this.$router.push({ name: 'feedback-error', params: { surveyId } });
        return;
      }

      const { surveyStats, cards } = feedbackDicts;

      const submissionsCount = surveyStats.submissions.length;
      if (!submissionsCount) {
        this.$router.push({ name: 'survey-home', params: { surveyId } });
        return;
      }

      const foods = surveyStats.getReducedFoods(day);
      const averageIntake = surveyStats.getAverageIntake(day);
      const fruitAndVegPortions = surveyStats.getFruitAndVegPortions(day);

      this.currentDay = day;
      this.daysRecorded = submissionsCount;
      this.cards = this.buildCardParams(cards, {
        foods,
        userDemographic,
        averageIntake,
        fruitAndVegPortions,
      });
      this.topFoods = getTopFoods(feedbackScheme.topFoods, foods, this.$i18n.locale);
    },
  },
});
</script>

<style lang="scss"></style>
