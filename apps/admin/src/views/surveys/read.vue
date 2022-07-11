<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
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
          <td>{{ entry.startDate }}</td>
          <th>{{ $t('surveys.endDate') }}</th>
          <td>{{ entry.endDate }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.supportEmail') }}</th>
          <td>{{ entry.supportEmail }}</td>
          <th>{{ $t('surveys.states._') }}</th>
          <td>{{ $t(`surveys.states.${entry.state}`) }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.users.allowGenUsers') }}</th>
          <td>{{ $t(`common.${entry.allowGenUsers}`) }}</td>
          <th>{{ $t('surveys.users.genUserKey') }}</th>
          <td>{{ entry.genUserKey }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.users.personalIdentifiers') }}</th>
          <td>{{ $t(`common.${entry.userPersonalIdentifiers}`) }}</td>
          <th>{{ $t('surveys.users.customFields') }}</th>
          <td>{{ $t(`common.${entry.userCustomFields}`) }}</td>
        </tr>
        <tr>
          <th>{{ $t('surveys.submissionNotificationUrl') }}</th>
          <td>{{ entry.submissionNotificationUrl }}</td>
          <th>{{ $t('surveys.storeUserSessionOnServer') }}</th>
          <td>{{ $t(`common.${entry.storeUserSessionOnServer}`) }}</td>
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
        <tr v-if="entry.feedbackScheme">
          <th>{{ $t('feedback-schemes._') }}</th>
          <td>{{ entry.feedbackScheme.name }}</td>
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
        <tr>
          <th>{{ $t('surveys.search.sortingAlgorithm') }}</th>
          <td>{{ $t(`surveys.search.algorithms.${entry.searchSortingAlgorithm}`) }}</td>
          <th>{{ $t('surveys.search.matchScoreWeight') }}</th>
          <td>{{ entry.searchMatchScoreWeight }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import type { SurveyEntry } from '@intake24/common/types/http/admin';

export default defineComponent({
  name: 'SurveyDetail',

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<SurveyEntry>(props.id);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
