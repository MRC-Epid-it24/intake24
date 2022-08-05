<template>
  <div>
    <v-card-title>{{ $t('tasks.params') }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select
            :value="value.store"
            :items="stores"
            :label="$t('jobs.types.CleanRedisStore.stores._')"
            name="store"
            outlined
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
import type { JobParams } from '@intake24/common/types';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import jobParams from './job-params';

export default defineComponent({
  name: 'CleanRedisStore',

  mixins: [jobParams],

  props: {
    value: {
      type: Object as PropType<JobParams['CleanRedisStore']>,
      required: true,
    },
  },

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
