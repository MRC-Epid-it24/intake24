<template>
  <v-row v-if="jobs.length">
    <v-col cols="12">
      <v-list two-line class>
        <v-list-item v-for="job in jobs" :key="job.id">
          <v-list-item-avatar>
            <v-icon class="grey" dark>fa-running</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ $t(`jobs.types.${job.type}`) }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ $t('common.startedAt') }}:
              {{ job.startedAt ? new Date(job.startedAt).toLocaleString() : $t('common.na') }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ $t('common.completedAt') }}:
              {{ job.completedAt ? new Date(job.completedAt).toLocaleString() : $t('common.na') }}
            </v-list-item-subtitle>
            <p v-if="job.message">{{ job.message }}</p>
          </v-list-item-content>
          <v-list-item-action v-if="job.downloadUrl">
            <v-btn :title="$t('common.action.download')" icon large link @click="download(job)">
              <v-icon color="primary">fa-download</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-progress-circular
              indeterminate
              color="secondary"
              v-if="job.progress != 1"
            ></v-progress-circular>
            <template v-else>
              <v-icon v-if="job.successful" color="success" large>fa-check-circle</v-icon>
              <v-icon v-if="!job.successful" color="error" large>fa-times-circle</v-icon>
            </template>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { JobEntry } from '@common/types/http/admin';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'DataTable',

  props: {
    jobs: {
      type: Array as () => JobEntry[],
      default: () => [],
    },
  },

  methods: {
    download(job: JobEntry) {
      this.$emit('download', job);
    },
  },
});
</script>

<style lang="scss" scoped></style>
