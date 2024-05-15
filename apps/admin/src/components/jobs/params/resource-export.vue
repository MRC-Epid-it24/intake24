<template>
  <div>
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select
            v-model="params.resource"
            :error-messages="errors.get('params.resource')"
            hide-details="auto"
            :items="resourceItems"
            :label="$t('jobs.types.ResourceExport.resource')"
            name="resource"
            outlined
            prepend-inner-icon="fas fa-list"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { type JobParams, resources } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n/index';

import jobParams from './job-params';

export default defineComponent({
  name: 'ResourceExport',

  mixins: [jobParams<JobParams['ResourceExport']>()],

  setup() {
    const { i18n } = useI18n();

    const resourceItems = resources.map(value => ({
      text: i18n.t(`${value}.title`).toString(),
      value,
    }));

    return {
      resourceItems,
    };
  },
});
</script>

<style scoped></style>
