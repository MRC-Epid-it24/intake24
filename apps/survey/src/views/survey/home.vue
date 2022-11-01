<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row justify="center" :no-gutters="isMobile">
      <v-col cols="12" lg="9">
        <v-card :flat="isMobile" :tile="isMobile">
          <v-list subheader two-line>
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
          <v-list subheader>
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
            <v-list-item v-else link>
              <v-list-item-content>
                <v-list-item-title v-if="hasStarted">
                  {{ $t('recall.inProgress', { startedAt: startTime?.toLocaleString() }) }}
                </v-list-item-title>
                <v-list-item-title v-else>
                  {{ $t('recall.none') }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  color="primary"
                  outlined
                  rounded
                  :title="$t(`recall.${hasStarted ? 'continue' : 'start'}`)"
                  :to="{ name: 'survey-recall', params: { surveyId } }"
                >
                  <v-icon :left="!isMobile">
                    {{ `fas fa-beat ${hasStarted ? `fa-pause` : `fa-play`}` }}
                  </v-icon>
                  <span v-if="!isMobile">
                    {{ $t(`recall.${hasStarted ? 'continue' : 'start'}`) }}
                  </span>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list subheader>
            <v-subheader>{{ $t('feedback.info') }}</v-subheader>
            <template v-if="feedbackEnabled">
              <v-list-item v-if="feedbackAvailable" link>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('feedback.status.available') }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    color="primary"
                    outlined
                    rounded
                    :to="{ name: 'feedback-home', params: { surveyId } }"
                  >
                    <v-icon left>$feedback</v-icon>
                    {{ $t(`feedback._`) }}
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item v-else link>
                <v-list-item-avatar>
                  <v-icon color="info" large>fas fa-circle-info</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{
                    $t('feedback.status.lowRecalls', {
                      minRecalls: parameters?.numberOfSubmissionsForFeedback,
                    })
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item v-else>
              <v-list-item-avatar>
                <v-icon color="error">fas fa-ban</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ $t('feedback.status.notAvailable') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list subheader two-line>
            <v-subheader>{{ $t('recall.past') }}</v-subheader>
            <template v-for="(submission, idx) in submissions">
              <v-list-item :key="submission.id" link>
                <v-list-item-icon>
                  <v-icon v-if="!idx" large>$survey</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ `${$t('recall.submissions._')} ${idx + 1}` }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ `${new Date(submission.endTime).toLocaleDateString()}` }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider
                v-if="idx + 1 < submissions.length"
                :key="`div-${submission.id}`"
                inset
              ></v-divider>
            </template>
          </v-list>
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

export default defineComponent({
  name: 'SurveyHome',

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

    return {
      submissions,
      startTime,
    };
  },

  computed: {
    ...mapState(useSurvey, [
      'feedbackAvailable',
      'feedbackEnabled',
      'hasStarted',
      'dailyLimitReached',
      'totalLimitReached',
      'limitReached',
      'parameters',
    ]),
  },

  async mounted() {
    this.submissions = await userService.submissions(this.surveyId);
  },
});
</script>
