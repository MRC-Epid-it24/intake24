<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('surveys._') }}</th>
          <td>{{ entry.id }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.locale') }}</th>
          <td>{{ entry.localeId }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.scheme') }}</th>
          <td>{{ entry.schemeId }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.startDate') }}</th>
          <td>{{ entry.startDate }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.endDate') }}</th>
          <td>{{ entry.endDate }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.supportEmail') }}</th>
          <td>{{ entry.supportEmail }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.state._') }}</th>
          <td>{{ $t(`surveys.state.${entry.state}`) }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.allowGenUsers') }}</th>
          <td>{{ entry.allowGenUsers }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.feedback.enabled') }}</th>
          <td>{{ entry.feedbackEnabled }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.feedback.numberOfSubmissions') }}</th>
          <td>{{ entry.numberOfSubmissionsForFeedback }}</td>
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
  name: 'SurveyDetail',

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
