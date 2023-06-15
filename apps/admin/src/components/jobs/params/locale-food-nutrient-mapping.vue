<template>
  <div>
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            :disabled="disabled.localeId"
            hide-details="auto"
            :label="$t('jobs.types.LocaleFoodNutrientMapping.localeId')"
            name="localeId"
            outlined
            :value="value.localeId"
            @input="input('localeId', $event)"
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

import jobParams from './job-params';

export default defineComponent({
  name: 'PairwiseSearchCopyAssociations',

  mixins: [jobParams<JobParams['LocaleFoodNutrientMapping']>()],
});
</script>

<style scoped></style>
