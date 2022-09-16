<template>
  <div>
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            :disabled="disabled.sourceLocaleId"
            hide-details="auto"
            :label="$t('jobs.types.PairwiseSearchCopyAssociations.sourceLocaleId')"
            name="sourceLocaleId"
            outlined
            :value="value.sourceLocaleId"
            @input="input('sourceLocaleId', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            :disabled="disabled.targetLocaleId"
            hide-details="auto"
            :label="$t('jobs.types.PairwiseSearchCopyAssociations.targetLocaleId')"
            name="targetLocaleId"
            outlined
            :value="value.targetLocaleId"
            @input="input('targetLocaleId', $event)"
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
import { defineComponent } from 'vue';

import type { JobParams } from '@intake24/common/types';

import jobParams from './job-params';

export default defineComponent({
  name: 'PairwiseSearchCopyAssociations',

  mixins: [jobParams<JobParams['PairwiseSearchCopyAssociations']>()],
});
</script>

<style scoped></style>
