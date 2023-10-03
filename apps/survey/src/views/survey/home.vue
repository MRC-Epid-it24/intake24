<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row justify="center" :no-gutters="isMobile">
      <v-col cols="12" lg="9">
        <v-card :tile="isMobile">
          <!-- Survey info -->
          <v-list class="list-no-wrap" subheader two-line>
            <v-subheader>{{ $t('survey.info') }}</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('survey._') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ parameters?.name }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('survey.states._') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t(`survey.states.${parameters?.state}`) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <!-- Recall info -->
          <template v-if="recallAllowed">
            <v-list class="list__no-wrap" subheader>
              <v-subheader>{{ $t('recall.info') }}</v-subheader>
              <template v-if="limitReached">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon color="error" large>fas fa-ban</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t(`recall.limitReached.${dailyLimitReached ? 'daily' : 'total'}`) }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-else-if="hasFinished">
                <v-list-item link>
                  <v-list-item-avatar>
                    <v-icon color="info" large>$check</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('recall.finishedAt', { finishedAt: endTime?.toLocaleString() }) }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action v-if="!isMobile">
                    <v-btn
                      block
                      color="info"
                      outlined
                      rounded
                      :title="$t('recall.start.another')"
                      @click.stop="startRecall"
                    >
                      <v-icon left>fas fa-beat fa-play</v-icon>
                      {{ $t('recall.start.another') }}
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="isMobile">
                  <v-btn
                    block
                    color="info"
                    large
                    outlined
                    rounded
                    :title="$t('recall.start.another')"
                    @click.stop="startRecall"
                  >
                    <v-icon left>fas fa-beat fa-play</v-icon>
                    {{ $t('recall.start.another') }}
                  </v-btn>
                </v-list-item>
              </template>
              <template v-else-if="hasStarted">
                <v-list-item link>
                  <v-list-item-avatar>
                    <v-icon color="info" large>$pause</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('recall.startedAt', { startedAt: startTime?.toLocaleString() }) }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action v-if="!isMobile" class="align-stretch">
                    <v-btn
                      class="mb-2"
                      color="info"
                      outlined
                      rounded
                      :title="$t('recall.continue')"
                      :to="{ name: 'survey-recall', params: { surveyId } }"
                    >
                      <v-icon class="fa-beat" left>$pause</v-icon>
                      {{ $t('recall.continue') }}
                    </v-btn>
                    <confirm-dialog
                      :label="$t('recall.abort.label').toString()"
                      @confirm="cancelRecall"
                    >
                      <template #activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          color="error"
                          outlined
                          rounded
                          :title="$t('recall.abort.label')"
                          v-on="on"
                        >
                          <v-icon left>$cancel</v-icon>
                          {{ $t('recall.abort._') }}
                        </v-btn>
                      </template>
                      {{ $t('recall.abort.confirm') }}
                    </confirm-dialog>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="isMobile">
                  <confirm-dialog
                    :label="$t('recall.abort.label').toString()"
                    @confirm="cancelRecall"
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        class="flex-grow-1 mr-2"
                        color="primary"
                        large
                        outlined
                        rounded
                        :title="$t('recall.abort.label')"
                        v-on="on"
                      >
                        <v-icon left>$cancel</v-icon>
                        {{ $t('recall.abort._') }}
                      </v-btn>
                    </template>
                    {{ $t('recall.abort.confirm') }}
                  </confirm-dialog>
                  <v-btn
                    class="flex-grow-1"
                    color="info"
                    large
                    outlined
                    rounded
                    :title="$t('recall.continue')"
                    :to="{ name: 'survey-recall', params: { surveyId } }"
                  >
                    <v-icon class="fa-beat" left>$pause</v-icon>
                    {{ $t('recall.continue') }}
                  </v-btn>
                </v-list-item>
              </template>
              <template v-else>
                <v-list-item link>
                  <v-list-item-avatar>
                    <v-icon color="info" large>$start</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('recall.none') }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action v-if="!isMobile">
                    <v-btn
                      color="info"
                      outlined
                      rounded
                      :title="$t('recall.start._')"
                      :to="{ name: 'survey-recall', params: { surveyId } }"
                    >
                      <v-icon class="fa-beat" left>$start</v-icon>
                      {{ $t('recall.start._') }}
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="isMobile">
                  <v-btn
                    block
                    color="info"
                    large
                    outlined
                    rounded
                    :title="$t('recall.start._')"
                    :to="{ name: 'survey-recall', params: { surveyId } }"
                  >
                    <v-icon class="fa-beat" left>$start</v-icon>
                    {{ $t('recall.start._') }}
                  </v-btn>
                </v-list-item>
              </template>
            </v-list>
            <v-divider></v-divider>
          </template>
          <!-- Feedback info -->
          <template v-if="feedbackAllowed">
            <v-list class="list-no-wrap" subheader>
              <v-subheader>{{ $t('feedback.info') }}</v-subheader>
              <template v-if="feedbackAvailable">
                <v-list-item link>
                  <v-list-item-avatar>
                    <v-icon color="info" large>$feedback</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('feedback.status.available') }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action v-if="!isMobile">
                    <v-btn
                      color="info"
                      outlined
                      rounded
                      :to="{ name: 'feedback-home', params: { surveyId } }"
                    >
                      <v-icon left>$feedback</v-icon>
                      {{ $t(`feedback._`) }}
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="isMobile">
                  <v-btn
                    block
                    color="info"
                    large
                    outlined
                    rounded
                    :to="{ name: 'feedback-home', params: { surveyId } }"
                  >
                    <v-icon left>$feedback</v-icon>
                    {{ $t(`feedback._`) }}
                  </v-btn>
                </v-list-item>
              </template>
              <v-list-item v-else link>
                <v-list-item-avatar>
                  <v-icon color="info" large>$info</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{
                    $t('feedback.status.lowRecalls', {
                      minRecalls: parameters?.numberOfSubmissionsForFeedback,
                    })
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
          </template>
          <!-- Past recalls -->
          <v-card-subtitle>
            {{ $t('recall.submissions.past') }}
          </v-card-subtitle>
          <v-card-text class="py-0">
            <template v-if="submissions.length">
              <v-timeline dense>
                <v-timeline-item
                  v-for="(submission, idx) in submissions"
                  :key="submission.id"
                  :color="idx % 2 ? 'info' : 'primary'"
                  small
                >
                  <v-row class="pt-1">
                    <v-col>
                      <strong>{{ `${$t('recall.submissions._')} ${idx + 1}` }}</strong>
                      <div class="text-caption">
                        {{ `${new Date(submission.endTime).toLocaleDateString()}` }}
                      </div>
                    </v-col>
                  </v-row>
                </v-timeline-item>
              </v-timeline>
            </template>
            <v-list v-else class="list-no-wrap">
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon large>$survey</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $t('recall.submissions.none') }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { computed, defineComponent, ref } from 'vue';

import type { SurveySubmissionEntry } from '@intake24/common/types/http';
import { userService } from '@intake24/survey/services';
import { useSurvey } from '@intake24/survey/stores';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'SurveyHome',

  components: { ConfirmDialog },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup() {
    const submissions = ref<SurveySubmissionEntry[]>([]);
    const survey = useSurvey();
    const startTime = computed(() => survey.data.startTime);
    const endTime = computed(() => survey.data.endTime);

    return {
      survey,
      submissions,
      startTime,
      endTime,
    };
  },

  computed: {
    ...mapState(useSurvey, [
      'feedbackAllowed',
      'recallAllowed',
      'feedbackAvailable',
      'hasStarted',
      'hasFinished',
      'dailyLimitReached',
      'totalLimitReached',
      'limitReached',
      'parameters',
    ]),
  },

  async mounted() {
    this.submissions = await userService.submissions(this.surveyId);
  },

  methods: {
    async startRecall() {
      this.survey.startRecall(true);
      await this.$router.push({ name: 'survey-recall', params: { surveyId: this.surveyId } });
    },

    async cancelRecall() {
      await this.survey.cancelRecall();
    },
  },
});
</script>

<style lang="scss" scoped></style>
