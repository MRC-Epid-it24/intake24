<template>
  <div>
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-file-input
            hide-details="auto"
            :label="$t('common.file.csv')"
            name="file"
            outlined
            prepend-icon=""
            prepend-inner-icon="fas fa-paperclip"
            :value="value.file"
            @input="input('file', $event)"
          ></v-file-input>
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

import jobParams from './job-params';

export default defineComponent({
  name: 'FoodRankingCsvUpload',

  mixins: [jobParams<JobParams['FoodRankingCsvUpload']>()],
});
</script>

<style scoped></style>
