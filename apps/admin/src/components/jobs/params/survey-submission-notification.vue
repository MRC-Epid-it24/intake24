<template>
  <div>
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <select-resource
            v-model="params.surveyId"
            :error-messages="errors.get('params.surveyId')"
            :label="$t('surveys.id')"
            name="surveyId"
            resource="surveys"
          >
          </select-resource>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="params.submissionId"
            :error-messages="errors.get('params.submissionId')"
            hide-details="auto"
            :label="$t('surveys.submissions.id')"
            name="submissionId"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { JobParams } from '@intake24/common/types';
import { SelectResource } from '@intake24/admin/components/dialogs';

import jobParams from './job-params';

export default defineComponent({
  name: 'SurveySubmissionNotification',

  components: { SelectResource },

  mixins: [jobParams<JobParams['SurveySubmissionNotification']>()],
});
</script>

<style scoped></style>
