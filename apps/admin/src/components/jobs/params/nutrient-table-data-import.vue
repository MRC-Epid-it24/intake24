<template>
  <div>
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <select-resource
            item-name="description"
            resource="nutrient-tables"
            :value="value.nutrientTableId"
            @input="input('nutrientTableId', $event)"
          >
            <template #activator="{ attrs, on }">
              <v-text-field
                v-bind="attrs"
                hide-details="auto"
                :label="$t('nutrient-tables.id')"
                name="nutrientTableId"
                outlined
                prepend-inner-icon="$nutrient-tables"
                readonly
                :value="value.nutrientTableId"
                v-on="on"
              ></v-text-field>
            </template>
          </select-resource>
        </v-col>
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
import { SelectResource } from '@intake24/admin/components/dialogs';

import jobParams from './job-params';

export default defineComponent({
  name: 'NutrientTableDataImport',

  components: { SelectResource },

  mixins: [jobParams<JobParams['NutrientTableDataImport']>()],
});
</script>

<style scoped></style>
