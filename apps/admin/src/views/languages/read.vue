<template>
  <layout v-bind="{ id, entry }">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('languages.id') }}</th>
          <td>{{ entry.id }}</td>
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
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import type { LanguageEntry } from '@intake24/common/types/http/admin';

export default defineComponent({
  name: 'LocaleDetail',

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<LanguageEntry>(props.id);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
