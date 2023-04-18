<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('locales.code') }}</th>
          <td>{{ entry.code }}</td>
        </tr>
        <tr>
          <th>{{ $t('locales.prototypeLocaleId') }}</th>
          <td>{{ entry.prototypeLocaleId || $t('common.none') }}</td>
        </tr>
        <tr>
          <th>{{ $t('locales.englishName') }}</th>
          <td>{{ entry.englishName }}</td>
        </tr>
        <tr>
          <th>{{ $t('locales.localName') }}</th>
          <td>{{ entry.localName }}</td>
        </tr>
        <tr>
          <th>{{ $t('locales.respondentLanguageId') }}</th>
          <td>{{ entry.respondentLanguageId }}</td>
        </tr>
        <tr>
          <th>{{ $t('locales.adminLanguageId') }}</th>
          <td>{{ entry.adminLanguageId }}</td>
        </tr>
        <tr>
          <th>{{ $t('locales.countryFlagCode') }}</th>
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

import type { LocaleEntry } from '@intake24/common/types/http/admin';
import { detailMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch } from '@intake24/admin/composables';

export default defineComponent({
  name: 'LocaleDetail',

  mixins: [detailMixin],

  setup(props) {
    useEntryFetch(props);
    const { entry, entryLoaded, refs, refsLoaded } = useEntry<LocaleEntry>(props);

    return { entry, entryLoaded, refs, refsLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
