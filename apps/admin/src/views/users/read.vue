<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('users.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('users.simpleName') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('users.email') }}</th>
          <td>{{ entry.email }}</td>
        </tr>
        <tr>
          <th>{{ $t('users.phone') }}</th>
          <td>{{ entry.phone }}</td>
        </tr>
        <tr>
          <th>{{ $t('users.mfa._') }}</th>
          <td>{{ entry.multiFactorAuthentication ? $t('common.yes') : $t('common.no') }}</td>
        </tr>
        <tr>
          <th>{{ $t('users.notifications.email') }}</th>
          <td>{{ entry.emailNotifications ? $t('common.yes') : $t('common.no') }}</td>
        </tr>
        <tr>
          <th>{{ $t('users.notifications.sms') }}</th>
          <td>{{ entry.smsNotifications ? $t('common.yes') : $t('common.no') }}</td>
        </tr>
        <tr>
          <th>{{ $t('users.roles') }}</th>
          <td v-if="entry.roles">
            <div v-for="role in entry.roles" :key="role.userId">{{ role.role }}</div>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-card-title>
      {{ $t('users.customFields.title') }}
    </v-card-title>
    <v-simple-table>
      <thead>
        <tr>
          <th>{{ $t('users.customFields.name') }}</th>
          <th>{{ $t('users.customFields.value') }}</th>
        </tr>
      </thead>
      <tbody v-if="entry.customFields.length">
        <tr v-for="field in entry.customFields" :key="field.name">
          <th>{{ field.name }}</th>
          <td>{{ field.value }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="2">{{ $t('users.customFields.none') }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-card-title>
      {{ $t('users.aliases.title') }}
    </v-card-title>
    <v-simple-table>
      <thead>
        <tr>
          <th>{{ $t('users.aliases.surveyId') }}</th>
          <th>{{ $t('users.aliases.username') }}</th>
          <th>{{ $t('users.aliases.urlAuthToken') }}</th>
        </tr>
      </thead>
      <tbody v-if="entry.aliases.length">
        <tr v-for="alias in entry.aliases" :key="alias.name">
          <th>{{ alias.surveyId }}</th>
          <th>{{ alias.username }}</th>
          <td>{{ alias.urlAuthToken }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="2">{{ $t('users.aliases.none') }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { DetailMixin } from '@intake24/admin/types';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'UserDetail',

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
