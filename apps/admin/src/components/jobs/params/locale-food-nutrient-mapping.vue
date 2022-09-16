<template>
  <div>
    <v-card-title>{{ $t('tasks.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            hide-details="auto"
            :label="$t('jobs.types.LocaleFoodNutrientMapping.localeId')"
            name="localeId"
            outlined
            :value="value.localeId"
            @input="input('localeId', $event)"
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
  name: 'PairwiseSearchCopyAssociations',

  mixins: [jobParams],

  props: {
    value: {
      type: Object as PropType<JobParams['LocaleFoodNutrientMapping']>,
      required: true,
    },
  },
});
</script>

<style scoped></style>
