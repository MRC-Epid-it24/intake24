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
      <feedback-chart-area :food-data="topFoodData"></feedback-chart-area>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { feedbackService, FeedbackDictionaries } from '@intake24/survey/services';
import { Sentiment } from '@intake24/common/feedback';
import {
  AggregateFoodStats,
  CharacterRules,
  FruitAndVegPortions,
  FoodGroupFeedback,
  UserDemographic,
  getTopFoods,
} from '@intake24/survey/feedback';
import { FeedbackSchemeEntryResponse, FiveADayFeedback } from '@intake24/common/types/http';
import UserDemographicInfo from '@intake24/survey/components/feedback/user-demographic-info.vue';
import {
  FeedbackCardParameters,
  FiveADayCardParameters,
  FoodGroupCardParameters,
  PlayingCardDetails,
} from '@intake24/survey/components/feedback/cards';
import FeedbackChartArea from '../../components/feedback/feedback-chart-area.vue';

export default Vue.extend({
  name: 'FeedbackHome',

  components: { UserDemographicInfo, FeedbackChartArea },

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

      results: [] as FeedbackCardParameters[],
      topFoodData: getTopFoods({ max: 0, colors: [], nutrientTypes: [] }, [], this.$i18n.locale),

      tellMeMoreVisible: false,
      tellMeMoreDetails: [] as PlayingCardDetails[],
      daysRecorded: undefined as number | undefined,
      currentDay: undefined as number | undefined,
    };
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
      const { feedbackDicts, surveyId } = this;
      if (!feedbackDicts) {
        this.$router.push({ name: 'feedback-error', params: { surveyId } });
        return;
      }

      const {
        feedbackData: { fiveADay, physicalActivityLevels, weightTargets },
        surveyStats,
        physicalData,
        bmrCalc,
        characterRules,
        foodGroupFeedback,
      } = feedbackDicts;

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
        bmrCalc
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

      this.buildFeedbackCards(
        foods,
        averageIntake,
        fruitAndVegPortions,
        characterRules,
        fiveADay,
        foodGroupFeedback
      );

      const { feedbackScheme } = this;
      if (!feedbackScheme) return;

      this.topFoodData = getTopFoods(feedbackScheme.topFoods, foods, this.$i18n.locale);
    },

    buildFoodGroupFeedbackCards(
      foodGroupsFeedback: FoodGroupFeedback[],
      averageIntake: Map<string, number>
    ): FoodGroupCardParameters[] {
      return foodGroupsFeedback.map((feedback) => {
        let groupIntake = feedback.nutrients.reduce((total, nutrientId) => {
          const intake = averageIntake.get(nutrientId);
          if (intake !== undefined) return total + intake;

          return total;
        }, 0);

        groupIntake = Math.round(groupIntake * 10) / 10;

        const lowerCaseName = feedback.name.toLowerCase();
        const capitalisedName = feedback.name.charAt(0).toUpperCase() + feedback.name.substr(1);

        let warning;

        if (feedback.low && groupIntake < feedback.low.threshold) warning = feedback.low.message;
        else if (feedback.high && groupIntake > feedback.high.threshold)
          warning = feedback.high.message;

        const details = new PlayingCardDetails(
          `${capitalisedName} intake`,
          groupIntake,
          feedback.tellMeMoreText,
          feedback.recommendedIntake,
          'g',
          // undefined,
          '',
          Sentiment.GOOD,
          warning
        );

        return new FoodGroupCardParameters(
          feedback.name,
          groupIntake,
          FoodGroupFeedback.getBackgroundClassForFoodGroup(feedback.nutrients),
          details
        );
      });
    },

    buildFeedbackCards(
      foods: AggregateFoodStats[],
      averageIntake: Map<string, number>,
      fruitAndVegAverages: FruitAndVegPortions,
      characterRules: CharacterRules[],
      fiveADayFeedback: FiveADayFeedback,
      foodGroupsFeedback: FoodGroupFeedback[]
    ): void {
      const { userDemographic } = this;
      if (!userDemographic) return;

      this.results = characterRules
        .filter(
          (cr) =>
            !cr.displayInFeedbackStyle || cr.displayInFeedbackStyle === this.feedbackScheme?.type
        )
        .map((characterRule) => {
          const sentiment = characterRule.getSentiment(userDemographic, foods);
          if (!sentiment) {
            console.warn(
              'Sentiment for character',
              characterRule.type,
              'nutrientTypeIds',
              characterRule.nutrientTypeIds,
              'resulted empty. Demographic groups',
              characterRule.demographicGroups
            );
            return null;
          }

          return sentiment;
        })
        // filter falsy does not narrow down the type
        .filter((sentiment) => sentiment) as FeedbackCardParameters[];

      if (this.feedbackScheme?.type === 'default') {
        this.results.push(
          new FiveADayCardParameters(
            Math.round(fruitAndVegAverages.total * 10) / 10,
            fiveADayFeedback
          )
        );
        this.results.push(...this.buildFoodGroupFeedbackCards(foodGroupsFeedback, averageIntake));
      }
    },
  },
});
</script>

<style lang="scss"></style>
