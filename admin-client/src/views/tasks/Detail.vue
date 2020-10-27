<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('common.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('tasks.job') }}</th>
          <td>{{ entry.job }}</td>
        </tr>
        <tr>
          <th>{{ $t('tasks.cron') }}</th>
          <td>{{ entry.cron }}</td>
        </tr>
        <tr>
          <th>{{ $t('common.action.active') }}</th>
          <td>{{ entry.active }}</td>
        </tr>
        <tr>
          <th>{{ $t('common.description') }}</th>
          <td>{{ entry.description }}</td>
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
  name: 'TaskDetail',

  mixins: [detailMixin],
});
</script>

<style scoped></style>
