<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
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
          <th>{{ $t('locales.textDirections._') }}</th>
          <td>{{ entry.textDirection }}</td>
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
  name: 'LocaleDetail',

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
