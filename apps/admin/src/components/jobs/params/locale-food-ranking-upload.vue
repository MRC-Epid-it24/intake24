<template>
  <div>
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-file-input
            v-model="params.file"
            :error-messages="errors.get('params.file')"
            hide-details="auto"
            :label="$t('common.file.csv')"
            name="file"
            outlined
            prepend-icon=""
            prepend-inner-icon="fas fa-paperclip"
          ></v-file-input>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { JobParams } from '@intake24/common/types';

import jobParams from './job-params';

export default defineComponent({
  name: 'LocaleFoodRankingUpload',

  mixins: [jobParams<JobParams['LocaleFoodRankingUpload']>()],
});
</script>

<style scoped></style>
