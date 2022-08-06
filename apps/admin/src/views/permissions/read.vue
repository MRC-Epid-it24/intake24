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

import type { PermissionEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';

export default defineComponent({
  name: 'PermissionDetail',

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<PermissionEntry>(props.id);

    return { entry, entryLoaded };
  },
});
</script>

<style scoped></style>
