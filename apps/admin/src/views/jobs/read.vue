<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <template #actions>
      <confirm-dialog
        v-if="can({ action: 'edit' })"
        :activator-class="['ml-2']"
        color="primary"
        icon-left="fas fa-play"
        :label="$t('jobs.repeat._')"
        @confirm="repeat"
      >
        {{ $t('jobs.repeat.confirm') }}
      </confirm-dialog>
    </template>
    <v-table>
      <tbody>
        <tr>
          <th>{{ $t('common.id') }}</th>
          <td>{{ entry.id }}</td>
          <th>{{ $t('common.type') }}</th>
          <td>{{ entry.type }}</td>
        </tr>
        <tr>
          <th>{{ $t('users._') }}</th>
          <td colspan="3">
            {{ [entry.user?.name, entry.user?.email, entry.userId].filter(Boolean).join(', ') }}
          </td>
        </tr>
        <tr v-if="entry.downloadUrl && entry.downloadUrlExpiresAt">
          <th>{{ $t('jobs.downloadUrl') }}</th>
          <td>
            {{ entry.downloadUrl }}
            <v-btn
              v-if="downloadUrlAvailable(entry)"
              class="ml-2"
              icon
              size="large"
              :title="$t('common.action.download')"
              @click="download(entry)"
            >
              <v-icon color="secondary">
                $download
              </v-icon>
            </v-btn>
          </td>
          <th>{{ $t('jobs.downloadUrlExpiresAt') }}</th>
          <td>{{ formatDateTime(entry.downloadUrlExpiresAt) }}</td>
        </tr>
        <tr>
          <th>{{ $t('jobs.progress') }}</th>
          <td>{{ entry.progress }}</td>
          <th>{{ $t('jobs.successful') }}</th>
          <td>
            <v-icon v-if="entry.successful" color="success" start>
              $check
            </v-icon>
            <v-icon v-else color="error" start>
              $times
            </v-icon>
            {{ $t(`common.${entry.successful}`) }}
          </td>
        </tr>
        <tr>
          <th>{{ $t('jobs.message') }}</th>
          <td colspan="3">
            {{ entry.message }}
          </td>
        </tr>
        <tr>
          <th>{{ $t('jobs.stackTrace') }}</th>
          <td colspan="3">
            <pre v-if="entry.stackTrace && entry.stackTrace.length">
              {{ entry.stackTrace.join('\n') }}
            </pre>
          </td>
        </tr>
        <tr>
          <th>{{ $t('common.startedAt') }}</th>
          <td>{{ formatDateTime(entry.startedAt) }}</td>
          <th>{{ $t('common.completedAt') }}</th>
          <td>{{ formatDateTime(entry.completedAt) }}</td>
        </tr>
        <tr>
          <th>{{ $t('common.createdAt') }}</th>
          <td>{{ formatDateTime(entry.createdAt) }}</td>
          <th>{{ $t('common.updatedAt') }}</th>
          <td>{{ formatDateTime(entry.updatedAt) }}</td>
        </tr>
        <tr>
          <th>{{ $t('jobs.params') }}</th>
          <td colspan="3">
            <pre class="my-3">{{ JSON.stringify(entry.params, null, '\t') }}</pre>
          </td>
        </tr>
      </tbody>
    </v-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { detailMixin } from '@intake24/admin/components/entry';
import { useDownloadJob } from '@intake24/admin/components/jobs';
import { useDateTime, useEntry, useEntryFetch } from '@intake24/admin/composables';
import type { JobAttributes } from '@intake24/common/types/http/admin';
import { ConfirmDialog } from '@intake24/ui/components';

export default defineComponent({
  name: 'JobDetail',

  components: { ConfirmDialog },

  mixins: [detailMixin],

  setup(props) {
    useEntryFetch(props);
    const { entry, entryLoaded } = useEntry<JobAttributes>(props);
    const { formatDateTime } = useDateTime();
    const { download, downloadUrlAvailable } = useDownloadJob();

    return { download, downloadUrlAvailable, entry, entryLoaded, formatDateTime };
  },

  methods: {
    async repeat() {
      await this.$http.post(`admin/jobs/${this.id}/repeat`);
    },
  },
});
</script>

<style scoped></style>
