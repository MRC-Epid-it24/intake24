<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('common.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('common.displayName') }}</th>
          <td>{{ entry.displayName }}</td>
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
import { defineComponent } from 'vue';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';

export default defineComponent({
  name: 'RoleDetail',

  mixins: [detailMixin],
});
</script>

<style scoped></style>
