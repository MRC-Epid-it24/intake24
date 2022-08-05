<template>
  <v-row v-if="jobs.length">
    <v-col cols="12">
      <v-list two-line class>
        <template v-for="(job, idx) in jobs">
          <v-list-item :key="job.id">
            <v-list-item-avatar>
              <v-icon class="grey" dark>fa-running</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ $t(`jobs.types.${job.type}._`) }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('common.startedAt') }}:
                {{ job.startedAt ? new Date(job.startedAt).toLocaleString() : $t('common.na') }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="job.completedAt">
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
                v-if="(job.progress || 0) !== 1"
                :rotate="-90"
                :size="45"
                :width="6"
                :value="Math.ceil((job.progress || 0) * 100)"
                color="orange darken-3"
              >
                <span class="font-weight-bold text--secondary">
                  {{ Math.ceil((job.progress || 0) * 100) }}
                </span>
              </v-progress-circular>
              <template v-else>
                <v-icon v-if="job.successful" color="success" large>fa-check-circle</v-icon>
                <v-icon v-if="!job.successful" color="error" large>fa-times-circle</v-icon>
              </template>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="idx + 1 < jobs.length" :key="`div-${job.id}`"></v-divider>
        </template>
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { JobEntry } from '@intake24/common/types/http/admin';

export default defineComponent({
  name: 'PollsJobList',

  props: {
    jobs: {
      type: Array as PropType<JobEntry[]>,
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
