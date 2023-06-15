<template>
  <div>
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <select-resource
            resource="surveys"
            :value="value.surveyId"
            @input="input('surveyId', $event)"
          >
            <template #activator="{ attrs, on }">
              <v-text-field
                v-bind="attrs"
                hide-details="auto"
                :label="$t('surveys.id')"
                name="surveyId"
                outlined
                prepend-inner-icon="$surveys"
                readonly
                :value="value.surveyId"
                v-on="on"
              ></v-text-field>
            </template>
          </select-resource>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            hide-details="auto"
            :label="$t('surveys.submissions.id')"
            name="submissionId"
            outlined
            :value="value.submissionId"
            @input="input('submissionId', $event)"
          ></v-text-field>
        </v-col>
        <v-col v-for="(error, idx) in errors" :key="idx" cols="12">
          <v-alert text type="error">{{ error }}</v-alert>
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
