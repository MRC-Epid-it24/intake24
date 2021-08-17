<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <v-simple-table>
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
            {{ entry.user ? `${entry.user.name} (${entry.user.username})` : null }}
          </td>
        </tr>
        <tr>
          <th>{{ $t('jobs.downloadUrl') }}</th>
          <td>{{ entry.downloadUrl }}</td>
          <th>{{ $t('jobs.downloadUrlExpiresAt') }}</th>
          <td>{{ formatDate(entry.downloadUrlExpiresAt) }}</td>
        </tr>
        <tr>
          <th>{{ $t('jobs.progress') }}</th>
          <td>{{ entry.progress }}</td>
          <th>{{ $t('jobs.successful') }}</th>
          <td>
            <v-icon v-if="entry.successful" color="success" left>fa-check-circle</v-icon>
            <v-icon v-else color="error" left>fa-times-circle</v-icon>
            {{ $t(`common.${entry.successful}`) }}
          </td>
        </tr>
        <tr>
          <th>{{ $t('jobs.message') }}</th>
          <td colspan="3">{{ entry.message }}</td>
        </tr>
        <tr>
          <th>{{ $t('jobs.stackTrace') }}</th>
          <td colspan="3">
            <code v-if="entry.stackTrace">
              {{ entry.stackTrace }}
            </code>
          </td>
        </tr>
        <tr>
          <th>{{ $t('common.startedAt') }}</th>
          <td>{{ formatDate(entry.startedAt) }}</td>
          <th>{{ $t('common.completedAt') }}</th>
          <td>{{ formatDate(entry.completedAt) }}</td>
        </tr>
        <tr>
          <th>{{ $t('common.createdAt') }}</th>
          <td>{{ formatDate(entry.createdAt) }}</td>
          <th>{{ $t('common.updatedAt') }}</th>
          <td>{{ formatDate(entry.updatedAt) }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { JobEntry } from '@common/types/http/admin';
import FormatsDateTime from '@/mixins/FormatsDateTime';
import detailMixin from '@/components/entry/detailMixin';
import type { DetailMixin } from '@/types';

type Mixins = InstanceType<typeof FormatsDateTime>;

export default (Vue as VueConstructor<Vue & DetailMixin<JobEntry> & Mixins>).extend({
  name: 'JobDetail',

  mixins: [FormatsDateTime, detailMixin],
});
</script>

<style scoped></style>
