<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('locales.id') }}</th>
          <td>{{ entry.id }}</td>
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
            <span :class="`flag-icon flag-icon-${entry.countryFlagCode} mr-3`"></span>
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
import Vue, { VueConstructor } from 'vue';
import { DetailMixin } from '@intake24/admin/types';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'LocaleDetail',

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
