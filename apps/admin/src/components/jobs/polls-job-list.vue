<template>
  <v-list class two-line>
    <template v-for="(job, idx) in jobs">
      <v-list-item :key="job.id">
        <v-list-item-avatar>
          <v-icon class="grey" dark>$jobs</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ $t(`jobs.types.${job.type}._`) }}</v-list-item-title>
          <v-list-item-subtitle v-if="job.message">
            {{ job.message }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-chip small>
            {{ $t('common.startedAt') }}:
            {{ job.startedAt ? new Date(job.startedAt).toLocaleString() : $t('common.na') }}
          </v-chip>
          <v-chip v-if="job.completedAt" class="mt-1" small>
            {{ $t('common.completedAt') }}:
            {{ job.completedAt ? new Date(job.completedAt).toLocaleString() : $t('common.na') }}
          </v-chip>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn
            :disabled="!downloadUrlAvailable(job)"
            icon
            large
            link
            :title="$t('common.action.download')"
            @click="download(job)"
          >
            <v-icon color="secondary">$download</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-progress-circular
            v-if="(job.progress || 0) !== 1"
            color="info"
            :rotate="-90"
            :size="45"
            :value="Math.ceil((job.progress || 0) * 100)"
            :width="6"
          >
            <span class="font-weight-bold text--primary">
              {{ Math.ceil((job.progress || 0) * 100) }}
            </span>
          </v-progress-circular>
          <template v-else>
            <v-icon v-if="job.successful" color="success" large>$check</v-icon>
            <v-icon v-if="!job.successful" color="error" large>$times</v-icon>
          </template>
        </v-list-item-action>
      </v-list-item>
      <v-divider v-if="idx + 1 < jobs.length" :key="`div-${job.id}`"></v-divider>
    </template>
  </v-list>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { JobEntry } from '@intake24/common/types/http/admin';
import { downloadFile } from '@intake24/ui/util';

export default defineComponent({
  name: 'PollsJobList',

  props: {
    jobs: {
      type: Array as PropType<JobEntry[]>,
      default: () => [],
    },
  },

  setup() {
    const downloadUrlAvailable = (job: JobEntry) =>
      job.downloadUrl &&
      job.downloadUrlExpiresAt &&
      new Date(job.downloadUrlExpiresAt).getTime() > Date.now();

    return { downloadUrlAvailable };
  },

  methods: {
    async download(job: JobEntry) {
      const res = await this.$http.get(`admin/user/jobs/${job.id}/download`, {
        responseType: 'blob',
      });
      downloadFile(res, job.downloadUrl);
    },
  },
});
</script>

<style lang="scss" scoped></style>
