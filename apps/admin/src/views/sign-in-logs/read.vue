<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('common.id') }}</th>
          <td>{{ entry.id }}</td>
          <th>{{ $t('sign-in-logs.successful') }}</th>
          <td>
            <v-icon v-if="entry.successful" color="success">fa-check-circle</v-icon>
            <v-icon v-else color="error">fa-times-circle</v-icon>
          </td>
        </tr>
        <tr>
          <th>{{ $t('sign-in-logs.provider') }}</th>
          <td>{{ entry.provider }}</td>
          <th>{{ $t('sign-in-logs.providerKey') }}</th>
          <td>{{ entry.providerKey }}</td>
        </tr>
        <tr>
          <th>{{ $t('sign-in-logs.remoteAddress') }}</th>
          <td colspan="3">{{ entry.remoteAddress }}</td>
        </tr>
        <tr>
          <th>{{ $t('sign-in-logs.userAgent') }}</th>
          <td colspan="3">{{ entry.userAgent }}</td>
        </tr>
        <tr>
          <th>{{ $t('sign-in-logs.message') }}</th>
          <td colspan="3">{{ entry.message }}</td>
        </tr>
        <tr>
          <th>{{ $t('sign-in-logs.date') }}</th>
          <td colspan="3">{{ formatDate(entry.date) }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { SignInLogEntry } from '@intake24/common/types/http/admin';
import { detailMixin } from '@intake24/admin/components/entry';
import { useDateTime, useEntry, useEntryFetch } from '@intake24/admin/composables';

export default defineComponent({
  name: 'SignInLogDetail',

  mixins: [detailMixin],

  setup(props) {
    useEntryFetch(props);
    const { entry, entryLoaded } = useEntry<SignInLogEntry>(props);
    const { formatDate } = useDateTime();

    return { entry, entryLoaded, formatDate };
  },
});
</script>

<style scoped></style>
