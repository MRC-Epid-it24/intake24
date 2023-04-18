<template>
  <layout v-bind="{ id, entry }">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('languages.code') }}</th>
          <td>{{ entry.code }}</td>
        </tr>
        <tr>
          <th>{{ $t('languages.englishName') }}</th>
          <td>{{ entry.englishName }}</td>
        </tr>
        <tr>
          <th>{{ $t('languages.localName') }}</th>
          <td>{{ entry.localName }}</td>
        </tr>
        <tr>
          <th>{{ $t('languages.countryFlagCode') }}</th>
          <td>
            <span :class="`fi fi-${entry.countryFlagCode} mr-3`"></span>
            {{ entry.countryFlagCode }}
          </td>
        </tr>
        <tr>
          <th>{{ $t('languages.textDirections._') }}</th>
          <td>{{ entry.textDirection }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { LanguageEntry } from '@intake24/common/types/http/admin';
import { detailMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch } from '@intake24/admin/composables';

export default defineComponent({
  name: 'LocaleDetail',

  mixins: [detailMixin],

  setup(props) {
    useEntryFetch(props);
    const { entry, entryLoaded } = useEntry<LanguageEntry>(props);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
