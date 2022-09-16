<template>
  <div>
    <v-card-title>{{ $t('jobs.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select
            :items="stores"
            :label="$t('jobs.types.CleanRedisStore.stores._')"
            name="store"
            outlined
            :value="value.store"
            @change="input('store', $event)"
          ></v-select>
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
  name: 'CleanRedisStore',

  mixins: [jobParams<JobParams['CleanRedisStore']>()],

  data() {
    return {
      stores: ['cache', 'session'].map((value) => ({
        value,
        text: this.$t(`jobs.types.CleanRedisStore.stores.${value}`).toString(),
      })),
    };
  },
});
</script>

<style scoped></style>
