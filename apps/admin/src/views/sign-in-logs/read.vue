<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
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
import Vue, { VueConstructor } from 'vue';
import { SignInLogEntry } from '@common/types/http/admin';
import detailMixin from '@/components/entry/detail-mixin';
import FormatsDateTime from '@/mixins/FormatsDateTime';
import type { DetailMixin } from '@/types';

export default (Vue as VueConstructor<Vue & DetailMixin<SignInLogEntry>>).extend({
  name: 'SignInLogDetail',

  mixins: [detailMixin, FormatsDateTime],
});
</script>

<style scoped></style>
