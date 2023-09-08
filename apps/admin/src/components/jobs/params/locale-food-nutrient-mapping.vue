<template>
  <div v-if="!disabled.localeId">
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <select-resource v-model="params.localeId" item-name="englishName" resource="locales">
            <template #activator="{ attrs, on }">
              <v-text-field
                v-bind="attrs"
                :error-messages="errors.get('params.localeId')"
                hide-details="auto"
                :label="$t('jobs.types.LocaleFoodNutrientMapping.localeId')"
                name="localeId"
                outlined
                prepend-inner-icon="$locales"
                readonly
                :value="value.localeId"
                v-on="on"
              ></v-text-field>
            </template>
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
  name: 'LocaleFoodNutrientMapping',

  components: { SelectResource },

  mixins: [jobParams<JobParams['LocaleFoodNutrientMapping']>()],
});
</script>

<style scoped></style>
