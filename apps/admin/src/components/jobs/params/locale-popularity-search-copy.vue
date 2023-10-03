<template>
  <div>
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col v-if="!disabled.localeId" cols="12">
          <select-resource
            v-model="params.localeId"
            :error-messages="errors.get('params.localeId')"
            item-name="englishName"
            :label="$t('jobs.types.LocalePopularitySearchCopy.localeId')"
            name="localeId"
            resource="locales"
          >
          </select-resource>
        </v-col>
        <v-col cols="12">
          <select-resource
            v-model="params.sourceLocaleId"
            :disabled="disabled.sourceLocaleId"
            :error-messages="errors.get('params.sourceLocaleId')"
            item-name="englishName"
            :label="$t('jobs.types.LocalePopularitySearchCopy.sourceLocaleId')"
            name="sourceLocaleId"
            resource="locales"
          >
          </select-resource>
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
  name: 'LocalePopularitySearchCopy',

  components: { SelectResource },

  mixins: [jobParams<JobParams['LocalePopularitySearchCopy']>()],
});
</script>

<style scoped></style>
