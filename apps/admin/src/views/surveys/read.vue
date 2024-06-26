<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('surveys.id') }}</th>
          <td>{{ entry.slug }}</td>
          <th>{{ $t('surveys.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('locales._') }}</th>
          <td>{{ entry.locale.englishName }}</td>
          <th>{{ $t('survey-schemes._') }}</th>
          <td>{{ entry.surveyScheme.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.startDate') }}</th>
          <td>{{ formatDate(entry.startDate) }}</td>
          <th>{{ $t('surveys.endDate') }}</th>
          <td>{{ formatDate(entry.endDate) }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.supportEmail') }}</th>
          <td>{{ entry.supportEmail }}</td>
          <th>{{ $t('surveys.states._') }}</th>
          <td>{{ $t(`surveys.states.${entry.state}`) }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.externalComm.allowGenUsers') }}</th>
          <td>{{ $t(`common.${entry.allowGenUsers}`) }}</td>
          <th>{{ $t('surveys.externalComm.genUserKey') }}</th>
          <td>{{ entry.genUserKey }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.users.personalIdentifiers') }}</th>
          <td>{{ $t(`common.${entry.userPersonalIdentifiers}`) }}</td>
          <th>{{ $t('surveys.users.customFields') }}</th>
          <td>{{ $t(`common.${entry.userCustomFields}`) }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.session.storeOnServer') }}</th>
          <td>{{ $t(`common.${entry.storeUserSessionOnServer}`) }}</td>
          <th>{{ $t('surveys.session.lifetime._') }}</th>
          <td>{{ entry.sessionLifetime }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.submissionLimits.maxDaily') }}</th>
          <td>{{ entry.maximumDailySubmissions }}</td>
          <th>{{ $t('surveys.submissionLimits.maxTotal') }}</th>
          <td>{{ entry.maximumTotalSubmissions }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.submissionLimits.minInterval') }}</th>
          <td colspan="3">
            {{ entry.minimumSubmissionInterval }}
          </td>
        </tr>
        <tr v-if="entry.feedbackScheme">
          <th>{{ $t('feedback-schemes._') }}</th>
          <td>{{ entry.feedbackScheme.name }}</td>
          <th>{{ $t('surveys.feedback.numberOfSubmissions') }}</th>
          <td>{{ entry.numberOfSubmissionsForFeedback }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.auth.captcha') }}</th>
          <td>{{ $t(`common.${entry.authCaptcha}`) }}</td>
          <th>{{ $t('surveys.auth.urlDomainOverride') }}</th>
          <td>{{ entry.authUrlDomainOverride }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.auth.urlTokenCharset') }}</th>
          <td>{{ entry.authUrlTokenCharset }}</td>
          <th>{{ $t('surveys.auth.urlTokenLength') }}</th>
          <td>{{ entry.authUrlTokenLength }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.search.sortingAlgorithm') }}</th>
          <td>{{ $t(`surveys.search.algorithms.${entry.searchSettings.sortingAlgorithm}`) }}</td>
          <th>{{ $t('surveys.search.matchScoreWeight') }}</th>
          <td>{{ entry.searchSettings.matchScoreWeight }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { SurveyEntry } from '@intake24/common/types/http/admin';
import { detailMixin } from '@intake24/admin/components/entry';
import { useDateTime, useEntry, useEntryFetch } from '@intake24/admin/composables';

export default defineComponent({
  name: 'SurveyDetail',

  mixins: [detailMixin],

  setup(props) {
    useEntryFetch(props);
    const { formatDate } = useDateTime();
    const { entry, entryLoaded } = useEntry<SurveyEntry>(props);

    return { entry, entryLoaded, formatDate };
  },
});
</script>

<style lang="scss" scoped></style>
