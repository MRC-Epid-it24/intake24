<template>
  <div>
    <v-sheet color="white py-4">
      <h1 v-if="surveyName" class="text-h1 font-weight-medium text-center px-4 pb-4">
        {{ surveyName }}
      </h1>
      <h2 class="text-h2 font-weight-medium text-center px-4 pb-4">
        {{ $t('feedback.title', { name: userName ? `${userName}'s` : '' }) }}
      </h2>
      <v-container class="container-max">
        <v-row class="d-print-none" justify="center">
          <v-col cols="12" lg="7" md="8" xl="6">
            <v-row justify="space-around">
              <feedback-user-info
                v-if="userDemographic?.hasData()"
                v-bind="{ surveyId, userDemographic }"
              ></feedback-user-info>
              <feedback-outputs
                v-if="!!outputs.length"
                v-bind="{
                  outputs,
                  submissions:
                    submissions.length !== selectedSubmissions.length
                      ? selectedSubmissions
                      : undefined,
                  surveyId,
                }"
              ></feedback-outputs>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-print-none" justify="center">
          <v-col cols="12" lg="7" md="8" xl="6">
            <v-expansion-panels focusable>
              <v-expansion-panel>
                <v-expansion-panel-header
                  class="text-subtitle-1 font-weight-medium"
                  color="grey lighten-4"
                >
                  {{ $t('recall.submissions.title') }}
                  ({{
                    submissions.length === selectedSubmissions.length
                      ? $t('recall.submissions.all')
                      : selectedSubmissions.length
                  }})
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list flat>
                    <v-list-item-group
                      v-model="selectedSubmissions"
                      multiple
                      @change="buildFeedback"
                    >
                      <v-list-item
                        v-for="(submission, idx) in submissions"
                        :key="submission.id"
                        dense
                        :value="submission.id"
                      >
                        <template #default="{ active }">
                          <v-list-item-action class="my-0">
                            <v-checkbox :input-value="active"></v-checkbox>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ `${$t('recall.submissions._')} ${idx + 1}` }} |
                              {{ `${new Date(submission.endTime).toLocaleDateString()}` }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" lg="7" md="8" xl="6">
            <v-alert class="mb-0" color="info" icon="fas fa-circle-exclamation" text>
              {{ $t('feedback.missingFoods') }}
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <div v-if="feedbackScheme && feedbackDicts" class="d-flex flex-column">
      <feedback-cards
        v-if="showCards"
        v-bind="{ cards }"
        :class="`feedback-area order-${getSectionOrder('cards')}`"
      ></feedback-cards>
      <v-sheet v-if="showTopFoods" :class="`order-${getSectionOrder('topFoods')}`" color="white">
        <feedback-top-foods v-bind="{ topFoods }" class="feedback-area"></feedback-top-foods>
      </v-sheet>
      <feedback-meals
        v-if="showMeals"
        :class="`feedback-area order-${getSectionOrder('meals')}`"
        :config="feedbackScheme.meals"
        :nutrient-types="feedbackDicts.feedbackData.nutrientTypes"
        :submissions="submissions"
        :survey-stats="feedbackDicts.surveyStats"
      ></feedback-meals>
      <survey-rating
        v-if="showRating"
        v-bind="{ surveyId, type: 'feedback' }"
        :class="`feedback-area order-${getSectionOrder('rating')} d-print-none`"
      ></survey-rating>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import type { UserDemographic } from '@intake24/ui/feedback';
import { SurveyRating } from '@intake24/survey/components';
import { feedbackService, userService } from '@intake24/survey/services';
import { useLoading, useSurvey } from '@intake24/survey/stores';
import {
  buildCardParams,
  buildTopFoods,
  FeedbackCards,
  FeedbackMeals,
  FeedbackOutputs,
  FeedbackTopFoods,
  FeedbackUserInfo,
  useFeedback,
} from '@intake24/ui/feedback';

export default defineComponent({
  name: 'FeedbackHome',

  components: {
    FeedbackCards,
    FeedbackMeals,
    FeedbackOutputs,
    FeedbackTopFoods,
    FeedbackUserInfo,
    SurveyRating,
  },

  beforeRouteEnter({ params }, from, next) {
    useSurvey().feedbackAllowed ? next() : next({ name: 'survey-home', params });
  },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup() {
    const survey = useSurvey();
    const parameters = computed(() => survey.parameters);
    const surveyName = computed(() => parameters.value?.name);
    const userName = computed(() => survey.user?.name);
    const feedbackScheme = computed(() => parameters.value?.feedbackScheme);
    const outputs = computed(() => feedbackScheme.value?.outputs ?? []);
    const sections = computed(() => feedbackScheme.value?.sections ?? []);

    const userDemographic = ref<UserDemographic | null>(null);
    const selectedSubmissions = ref<string[]>([]);

    const {
      cards,
      feedbackDicts,
      getSectionOrder,
      topFoods,
      showCards,
      showMeals,
      showRating,
      showTopFoods,
    } = useFeedback(feedbackScheme);

    const submissions = computed(() => feedbackDicts.value?.surveyStats.submissions ?? []);

    return {
      userDemographic,
      selectedSubmissions,
      cards,
      feedbackDicts,
      getSectionOrder,
      topFoods,
      showCards,
      showMeals,
      showRating,
      showTopFoods,
      parameters,
      feedbackScheme,
      outputs,
      sections,
      surveyName,
      submissions,
      userName,
    };
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
      const { cards, demographicGroups: groups, henryCoefficients } = feedbackScheme;

      const { physicalData, submissions } = await this.getUserData(surveyId);
      if (feedbackScheme.physicalDataFields.some((item) => physicalData[item] === null)) {
        this.$router.push({ name: 'feedback-physical-data', params: { surveyId } });
        return;
      }

      const { feedbackDicts, userDemographic } = await feedbackService.getFeedbackResults({
        cards,
        groups,
        henryCoefficients,
        physicalData,
        submissions,
      });

      this.feedbackDicts = feedbackDicts;
      this.userDemographic = userDemographic;

      this.initSelectedSubmissions();
      this.buildFeedback();
    } catch (err) {
      await this.$router.push({ name: 'feedback-error', params: { surveyId } });

      throw err;
    } finally {
      loading.removeItem('feedback-initial-load');
    }
  },

  methods: {
    async initSelectedSubmissions() {
      const { submissions } = this.$route.query;
      const submissionIds = this.submissions.map(({ id }) => id);

      if (Array.isArray(submissions)) {
        this.selectedSubmissions = submissionIds.filter((id) => id && submissions.includes(id));
        await this.$router.replace(this.$route.path);
        return;
      }

      if (typeof submissions === 'string') {
        this.selectedSubmissions = [submissions];
        await this.$router.replace(this.$route.path);
        return;
      }

      this.selectedSubmissions = submissionIds;
    },

    async getUserData(surveyId: string) {
      const [physicalData, submissions] = await Promise.all([
        userService.fetchPhysicalData(),
        userService.submissions(surveyId),
      ]);

      return { physicalData, submissions };
    },

    buildFeedback() {
      const {
        feedbackDicts,
        feedbackScheme,
        selectedSubmissions,
        submissions,
        surveyId,
        userDemographic,
      } = this;

      if (!feedbackDicts || !feedbackScheme || !userDemographic) {
        this.$router.push({ name: 'feedback-error', params: { surveyId } });
        return;
      }

      const {
        cards,
        surveyStats,
        feedbackData: { nutrientTypes },
      } = feedbackDicts;

      const submissionsCount = surveyStats.submissions.length;
      if (!submissionsCount) {
        this.$router.push({ name: 'survey-home', params: { surveyId } });
        return;
      }

      const selected = selectedSubmissions.length
        ? selectedSubmissions
        : submissions.map(({ id }) => id);

      const foods = surveyStats.getReducedFoods(selected);
      const averageIntake = surveyStats.getAverageIntake(selected);
      const fruitAndVegPortions = surveyStats.getFruitAndVegPortions(selected);

      this.cards = buildCardParams(cards, {
        foods,
        userDemographic,
        averageIntake,
        fruitAndVegPortions,
      });
      this.topFoods = buildTopFoods(feedbackScheme.topFoods, foods, nutrientTypes);
    },
  },
});
</script>

<style lang="scss">
.feedback-area {
  padding-top: 32px !important;
  padding-bottom: 32px !important;

  @media print {
    padding: 0 !important;
  }
}
</style>
