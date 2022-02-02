<template>
  <v-row justify="center" :no-gutters="isMobile">
    <v-col cols="12" sm="9" md="8">
      <user-demographic-info
        v-if="userDemographic"
        :user-info="userDemographic"
      ></user-demographic-info>
    </v-col>
    <v-col cols="12" class="mt-4">
      <!-- Day selector -->
    </v-col>
    <v-col cols="12" class="mt-4">
      <feedback-card-area v-bind="{ results }"></feedback-card-area>
    </v-col>
    <v-col cols="12" class="mt-4">
      <feedback-chart-area v-bind="{ topFoods }"></feedback-chart-area>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { feedbackService, FeedbackDictionaries } from '@intake24/survey/services';
import { UserDemographic, getTopFoods } from '@intake24/survey/feedback';
import { FeedbackSchemeEntryResponse } from '@intake24/common/types/http';
import {
  FeedbackChartArea,
  FeedbackCardArea,
  UserDemographicInfo,
} from '@intake24/survey/components/feedback';
import { defineComponent } from '@vue/composition-api';
import {
  FeedbackParameters,
  buildCharacterParams,
  buildFoodGroupParams,
} from '@intake24/survey/feedback/groups-builder';

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

      results: [] as FeedbackParameters[],
      topFoods: getTopFoods({ max: 0, colors: [], nutrientTypes: [] }, [], this.$i18n.locale),

      daysRecorded: undefined as number | undefined,
      currentDay: undefined as number | undefined,
    };
  },

  setup() {
    return { buildCharacterParams, buildFoodGroupParams };
  },

  computed: {
    feedbackScheme(): FeedbackSchemeEntryResponse | null {
      return this.$store.state.survey.parameters.feedbackScheme;
    },
  },

  async mounted() {
    const { surveyId } = this;

    await this.$store.dispatch('loading/add', 'feedback-initial-load');

    try {
      this.feedbackDicts = await feedbackService.getFeedbackResults(surveyId);
      this.buildView();
    } catch (err) {
      console.log(`error`);
      await this.$store.dispatch('feedback/setError', err);
      this.$router.push({ name: 'feedback-error', params: { surveyId } });
    } finally {
      await this.$store.dispatch('loading/remove', 'feedback-initial-load');
    }
  },

  methods: {
    buildView(day?: number): void {
      const { feedbackDicts, feedbackScheme, surveyId } = this;
      if (!feedbackDicts || !feedbackScheme) {
        this.$router.push({ name: 'feedback-error', params: { surveyId } });
        return;
      }

      const {
        feedbackData: { physicalActivityLevels, weightTargets },
        surveyStats,
        physicalData,
        characterRules,
      } = feedbackDicts;

      const { foodGroups, type: feedbackType, henryCoefficients } = feedbackScheme;

      if (!physicalData) {
        this.$router.push({ name: 'feedback-physical-data', params: { surveyId } });
        return;
      }

      this.currentDay = day;

      const physicalActivityLevel = physicalActivityLevels.find(
        ({ id }) => id === physicalData.physicalActivityLevelId
      );
      const weightTarget = weightTargets.find(({ id }) => id === physicalData.weightTarget);

      if (!physicalActivityLevel) throw new Error('Unknown physical activity level');
      if (!weightTarget) throw new Error('Unknown weight target');

      this.userDemographic = new UserDemographic(
        physicalData,
        physicalActivityLevel,
        weightTarget,
        henryCoefficients
      );

      const submissionsCount = surveyStats.submissions.length;
      if (!submissionsCount) {
        this.$router.push({ name: 'survey-home', params: { surveyId } });
        return;
      }

      this.daysRecorded = submissionsCount;

      const foods = surveyStats.getReducedFoods(this.currentDay);
      const averageIntake = surveyStats.getAverageIntake(this.currentDay);
      const fruitAndVegPortions = surveyStats.getFruitAndVegPortions(this.currentDay);

      const characterParams = this.buildCharacterParams(
        foods,
        characterRules,
        this.userDemographic,
        feedbackType
      );

      const foodGroupParams = this.buildFoodGroupParams(
        foodGroups,
        averageIntake,
        fruitAndVegPortions
      );

      this.results = [...characterParams, ...foodGroupParams];

      this.topFoods = getTopFoods(feedbackScheme.topFoods, foods, this.$i18n.locale);
    },
  },
});
</script>

<style lang="scss"></style>
