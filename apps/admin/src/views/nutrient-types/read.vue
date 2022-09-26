<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('nutrient-types.id') }}</th>
          <td>{{ entry.id }}</td>
        </tr>
        <tr>
          <th>{{ $t('common.description') }}</th>
          <td>{{ entry.description }}</td>
        </tr>
        <tr>
          <th>{{ $t('nutrient-units._') }}</th>
          <td>{{ entry.unit?.description || $t('common.none') }}</td>
        </tr>
        <tr>
          <th>{{ $t('nutrient-types.kcalPerUnit') }}</th>
          <td>{{ entry.kcalPerUnit || $t('common.none') }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';

export default defineComponent({
  name: 'NutrientTypeDetail',

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<NutrientTypeEntry>(props.id);

    return { entry, entryLoaded, refs, refsLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
