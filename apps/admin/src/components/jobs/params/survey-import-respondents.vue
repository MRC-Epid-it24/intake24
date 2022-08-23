<template>
  <div>
    <v-card-title>{{ $t('tasks.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            hide-details="auto"
            :label="$t('surveys.id')"
            name="surveyId"
            outlined
            :value="value.surveyId"
            @input="input('surveyId', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            hide-details="auto"
            :label="$t('common.file')"
            name="file"
            outlined
            :value="value.file"
            @input="input('file', $event)"
          ></v-text-field>
        </v-col>
        <v-col v-if="error" cols="12">
          <v-alert text type="error">
            {{ error }}
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { JobParams } from '@intake24/common/types';

import jobParams from './job-params';

export default defineComponent({
  name: 'SurveyImportRespondents',

  mixins: [jobParams],

  props: {
    value: {
      type: Object as PropType<JobParams['SurveyImportRespondents']>,
      required: true,
    },
  },
});
</script>

<style scoped></style>
