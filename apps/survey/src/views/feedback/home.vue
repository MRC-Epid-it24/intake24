<template>
  <v-container class="pa-0" fluid>
    <v-sheet color="white py-4">
      <h1 v-if="surveyName" class="text-h1 font-weight-medium text-center mb-4">
        {{ surveyName }}
      </h1>
      <h2 class="text-h2 font-weight-medium text-center mb-4">{{ $t('feedback.title') }}</h2>
      <v-row no-gutters justify="center" class="pa-4 d-print-none">
        <v-col cols="12" md="7">
          <v-row justify="space-around">
            <feedback-user-info
              v-bind="{ surveyId, userDemographic }"
              v-if="userDemographic"
            ></feedback-user-info>
            <v-divider
              v-if="userDemographic && !!outputs.length"
              vertical
              class="d-none d-sm-block"
            ></v-divider>
            <feedback-outputs
              v-bind="{
                outputs,
                submissions:
                  submissions.length !== selectedSubmissions.length
                    ? selectedSubmissions
                    : undefined,
                surveyId,
              }"
              v-if="!!outputs.length"
            ></feedback-outputs>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center" class="pa-4 d-print-none">
        <v-col cols="12" md="6">
          <v-divider></v-divider>
          <v-expansion-panels flat focusable tile>
            <v-expansion-panel>
              <v-expansion-panel-header class="text-subtitle-1 font-weight-medium">
                {{ $t('feedback.submissions.title') }}
                ({{
                  submissions.length === selectedSubmissions.length
                    ? $t('feedback.submissions.all')
                    : selectedSubmissions.length
                }})
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list flat>
                  <v-list-item-group v-model="selectedSubmissions" multiple @change="buildFeedback">
                    <v-list-item
                      v-for="(submission, idx) in submissions"
                      :key="submission.id"
                      :value="submission.id"
                      active-class="blue--text text--darken-3"
                      dense
                    >
                      <template v-slot:default="{ active }">
                        <v-list-item-action class="my-0">
                          <v-checkbox :input-value="active" color="blue darken-3"></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ `${$t('feedback.submissions._')} #${idx + 1}` }} |
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
      <v-row no-gutters justify="center" class="px-4">
        <v-col cols="auto">
          <v-alert text class="mb-0" color="blue darken-3" icon="fas fa-circle-exclamation">
            {{ $t('feedback.missingFoods') }}
          </v-alert>
        </v-col>
      </v-row>
    </v-sheet>
    <feedback-card-area
      v-if="cards.length"
      v-bind="{ cards }"
      class="feedback-area"
    ></feedback-card-area>
    <v-sheet color="white" v-if="topFoods.nutrients.length">
      <feedback-chart-area v-bind="{ topFoods }" class="feedback-area"></feedback-chart-area>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { mapState } from 'pinia';
import type {
  FeedbackCardParameters,
  FeedbackDictionaries,
  SurveySubmission,
  UserDemographic,
} from '@intake24/ui/feedback';
import { buildTopFoods, buildCardParams } from '@intake24/ui/feedback';
import type { FeedbackSchemeEntryResponse } from '@intake24/common/types/http';
import {
  FeedbackChartArea,
  FeedbackCardArea,
  FeedbackOutputs,
  FeedbackUserInfo,
} from '@intake24/ui/components/feedback';
import { feedbackService, userService } from '@intake24/survey/services';
import { useLoading, useSurvey } from '@intake24/survey/stores';
import type { FeedbackOutput } from '@intake24/common/feedback';

export default defineComponent({
  name: 'FeedbackHome',

  components: { FeedbackCardArea, FeedbackChartArea, FeedbackOutputs, FeedbackUserInfo },

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
      topFoods: buildTopFoods({ max: 0, colors: [], nutrientTypes: [] }, [], [], this.$i18n.locale),

      selectedSubmissions: [] as string[],
    };
  },

  computed: {
    ...mapState(useSurvey, ['parameters']),

    feedbackScheme(): FeedbackSchemeEntryResponse | undefined {
      return this.parameters?.feedbackScheme;
    },

    outputs(): FeedbackOutput[] {
      return this.feedbackScheme?.outputs ?? [];
    },

    surveyName(): string | undefined {
      return this.parameters?.name;
    },

    submissions(): SurveySubmission[] {
      return this.feedbackDicts?.surveyStats.submissions ?? [];
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
      const { cards, demographicGroups: groups, henryCoefficients } = feedbackScheme;

      const { physicalData, submissions } = await this.getUserData(surveyId);
      if (
        !physicalData ||
        feedbackScheme.physicalDataFields.some((item) => physicalData[item] === null)
      ) {
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
      console.log(err);
      this.$router.push({ name: 'feedback-error', params: { surveyId } });
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
      this.topFoods = buildTopFoods(
        feedbackScheme.topFoods,
        foods,
        nutrientTypes,
        this.$i18n.locale
      );
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
