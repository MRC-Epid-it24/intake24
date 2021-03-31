<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('surveys._') }}</th>
          <td>{{ entry.id }}</td>
          <th>{{ $t('surveys.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.locale') }}</th>
          <td>{{ entry.localeId }}</td>
          <th>{{ $t('surveys.scheme') }}</th>
          <td>{{ entry.schemeId }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.startDate') }}</th>
          <td>{{ entry.startDate }}</td>
          <th>{{ $t('surveys.endDate') }}</th>
          <td>{{ entry.endDate }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.supportEmail') }}</th>
          <td>{{ entry.supportEmail }}</td>
          <th>{{ $t('surveys.state._') }}</th>
          <td>{{ $t(`surveys.state.${entry.state}`) }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.genUsers.allow') }}</th>
          <td>{{ entry.allowGenUsers }}</td>
          <th>{{ $t('surveys.genUsers.secret') }}</th>
          <td>{{ entry.genUserKey }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.submissionLimits.maxDaily') }}</th>
          <td>{{ entry.maximumDailySubmissions }}</td>
          <th>{{ $t('surveys.submissionLimits.maxTotal') }}</th>
          <td>{{ entry.maximumTotalSubmissions }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.submissionLimits.minInterval') }}</th>
          <td colspan="3">{{ entry.minimumSubmissionInterval }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.storeUserSessionOnServer') }}</th>
          <td colspan="3">{{ entry.storeUserSessionOnServer }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.feedback.enabled') }}</th>
          <td>{{ entry.feedbackEnabled }}</td>
          <th>{{ $t('surveys.feedback.numberOfSubmissions') }}</th>
          <td>{{ entry.numberOfSubmissionsForFeedback }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.authUrl.domainOverride') }}</th>
          <td colspan="3">{{ entry.authUrlDomainOverride }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.authUrl.tokenCharset') }}</th>
          <td>{{ entry.authUrlTokenCharset }}</td>
          <th>{{ $t('surveys.authUrl.tokenLength') }}</th>
          <td>{{ entry.authUrlTokenLength }}</td>
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
