<template>
  <div>
    <v-card-title>{{ $t('tasks.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            :value="value.sourceLocaleId"
            :label="$t('jobs.types.LocaleCopyPairwiseAssociations.sourceLocaleId')"
            hide-details="auto"
            name="sourceLocaleId"
            outlined
            @input="input('sourceLocaleId', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            :value="value.targetLocaleId"
            :label="$t('jobs.types.LocaleCopyPairwiseAssociations.targetLocaleId')"
            hide-details="auto"
            name="targetLocaleId"
            outlined
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
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { JobParams } from '@intake24/common/types';

import jobParams from './job-params';

export default defineComponent({
  name: 'LocaleCopyPairwiseAssociations',

  mixins: [jobParams],

  props: {
    value: {
      type: Object as PropType<JobParams['LocaleCopyPairwiseAssociations']>,
      required: true,
    },
  },
});
</script>

<style scoped></style>
