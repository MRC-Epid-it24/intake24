<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
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
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { DetailMixin } from '@/types/vue';
import detailMixin from '@/components/entry/detailMixin';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'UserDetail',

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
