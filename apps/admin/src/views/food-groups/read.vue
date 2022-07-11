<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('common.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import type { FoodGroupEntry } from '@intake24/common/types/http/admin';

export default defineComponent({
  name: 'FoodGroupDetail',

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<FoodGroupEntry>(props.id);

    return { entry, entryLoaded };
  },
});
</script>

<style scoped></style>
