<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form autocomplete="off" @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.slug"
                :disabled="isEdit"
                :error-messages="form.errors.get('slug')"
                hide-details="auto"
                :label="$t('surveys.id')"
                name="slug"
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('surveys.name')"
                name="name"
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <select-resource
                v-model="form.localeId"
                :error-messages="form.errors.get('localeId')"
                :initial-item="entry.locale"
                item-name="englishName"
                :label="$t('locales._')"
                name="localeId"
                resource="locales"
                @input="form.errors.clear('localeId')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <select-resource
                v-model="form.surveySchemeId"
                :error-messages="form.errors.get('surveySchemeId')"
                :initial-item="entry.surveyScheme"
                :label="$t('survey-schemes._')"
                name="surveySchemeId"
                resource="survey-schemes"
                @input="form.errors.clear('surveySchemeId')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <date-picker
                v-model="form.startDate"
                :error-messages="form.errors.get('startDate')"
                :label="$t('surveys.startDate').toString()"
                @change="form.errors.clear('startDate')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <date-picker
                v-model="form.endDate"
                :error-messages="form.errors.get('endDate')"
                :label="$t('surveys.endDate').toString()"
                @change="form.errors.clear('endDate')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.supportEmail"
                autocomplete="off"
                :error-messages="form.errors.get('supportEmail')"
                hide-details="auto"
                :label="$t('surveys.supportEmail')"
                name="supportEmail"
                outlined
                prepend-inner-icon="fas fa-envelope"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.state"
                :error-messages="form.errors.get('state')"
                hide-details="auto"
                :items="surveyStates"
                :label="$t('surveys.states._')"
                name="state"
                outlined
                prepend-inner-icon="fas fa-spinner"
                @change="form.errors.clear('state')"
              />
            </v-col>
            <v-col v-show="form.state === 'suspended'" cols="12">
              <v-text-field
                v-model="form.suspensionReason"
                :error-messages="form.errors.get('suspensionReason')"
                hide-details="auto"
                :label="$t('surveys.suspensionReason')"
                name="suspensionReason"
                outlined
              />
            </v-col>
          </v-row>
          <v-divider class="my-6" />
          <v-row>
            <v-col cols="12" md>
              <div class="text-h5 mb-4">
                {{ $t('surveys.search._') }}
              </div>
              <v-switch
                v-model="form.searchSettings.collectData"
                class="my-6"
                :error-messages="form.errors.get('searchSettings.collectData')"
                hide-details="auto"
                :label="$t('surveys.search.collectData')"
                name="searchCollectData"
                @change="form.errors.clear('searchSettings.collectData')"
              />
              <v-select
                v-model="form.searchSettings.sortingAlgorithm"
                :error-messages="form.errors.get('searchSettings.sortingAlgorithm')"
                hide-details="auto"
                :items="searchSortingAlgorithms"
                :label="$t('surveys.search.sortingAlgorithm')"
                name="searchSortingAlgorithm"
                outlined
                prepend-inner-icon="fas fa-arrow-up-wide-short"
                @change="form.errors.clear('searchSettings.sortingAlgorithm')"
              />
              <v-slider
                v-model.number="form.searchSettings.matchScoreWeight"
                class="mt-10"
                :error-messages="form.errors.get('searchSettings.matchScoreWeight')"
                hide-details="auto"
                :label="$t('surveys.search.matchScoreWeight')"
                max="100"
                min="0"
                name="searchMatchScoreWeight"
                thumb-label="always"
              />
              <v-slider
                v-model.number="form.searchSettings.minWordLength1"
                class="mt-10"
                :error-messages="form.errors.get('searchSettings.minWordLength1')"
                hide-details="auto"
                :label="$t('surveys.search.searchMinWordLength1')"
                max="10"
                min="2"
                name="searchMatchScoreWeight"
                thumb-label="always"
              />
              <v-slider
                v-model.number="form.searchSettings.minWordLength2"
                class="mt-10"
                :error-messages="form.errors.get('searchSettings.minWordLength2')"
                hide-details="auto"
                :label="$t('surveys.search.searchMinWordLength2')"
                max="10"
                min="3"
                name="searchMatchScoreWeight"
                thumb-label="always"
              />
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mdAndUp ? `auto` : '12'">
              <v-divider :vertical="$vuetify.breakpoint.mdAndUp" />
            </v-col>
            <v-col cols="12" md>
              <div class="text-h5 mb-4">
                {{ $t('surveys.users._') }}
              </div>
              <v-switch
                v-model="form.userPersonalIdentifiers"
                :error-messages="form.errors.get('userPersonalIdentifiers')"
                hide-details="auto"
                :label="$t('surveys.users.personalIdentifiers')"
                name="userPersonalIdentifiers"
                @change="form.errors.clear('userPersonalIdentifiers')"
              />
              <v-switch
                v-model="form.userCustomFields"
                :error-messages="form.errors.get('userCustomFields')"
                hide-details="auto"
                :label="$t('surveys.users.customFields')"
                name="userCustomFields"
                @change="form.errors.clear('userCustomFields')"
              />
            </v-col>
          </v-row>
          <v-divider class="my-6" />
          <v-row>
            <v-col cols="12" md>
              <div class="text-h5 mb-4">
                {{ $t('surveys.auth._') }}
              </div>
              <v-switch
                v-model="form.authCaptcha"
                class="my-6"
                :error-messages="form.errors.get('authCaptcha')"
                hide-details="auto"
                :label="$t('surveys.auth.captcha')"
                name="authCaptcha"
                @change="form.errors.clear('authCaptcha')"
              />
              <v-text-field
                v-model="form.authUrlTokenCharset"
                class="mb-4"
                :error-messages="form.errors.get('authUrlTokenCharset')"
                hide-details="auto"
                :label="$t('surveys.auth.urlTokenCharset')"
                name="authUrlTokenCharset"
                outlined
                prepend-inner-icon="fas fa-font"
              />
              <v-text-field
                v-model.number="form.authUrlTokenLength"
                class="mb-4"
                :error-messages="form.errors.get('authUrlTokenLength')"
                hide-details="auto"
                :label="$t('surveys.auth.urlTokenLength')"
                name="authUrlTokenLength"
                outlined
                prepend-inner-icon="fas fa-ruler-horizontal"
              />
              <v-text-field
                v-model="form.authUrlDomainOverride"
                :error-messages="form.errors.get('authUrlDomainOverride')"
                hide-details="auto"
                :label="$t('surveys.auth.urlDomainOverride')"
                name="authUrlDomainOverride"
                outlined
                prepend-inner-icon="fas fa-up-right-from-square"
              />
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mdAndUp ? `auto` : '12'">
              <v-divider :vertical="$vuetify.breakpoint.mdAndUp" />
            </v-col>
            <v-col cols="12" md>
              <div class="text-h5 mb-4">
                {{ $t('surveys.submissionLimits._') }}
              </div>
              <v-text-field
                v-model.number="form.maximumDailySubmissions"
                class="mb-4"
                :error-messages="form.errors.get('maximumDailySubmissions')"
                hide-details="auto"
                :label="$t('surveys.submissionLimits.maxDaily')"
                name="maximumDailySubmissions"
                outlined
              />
              <v-text-field
                v-model.number="form.maximumTotalSubmissions"
                class="mb-4"
                :error-messages="form.errors.get('maximumTotalSubmissions')"
                hide-details="auto"
                :label="$t('surveys.submissionLimits.maxTotal')"
                name="maximumTotalSubmissions"
                outlined
              />
              <v-text-field
                v-model.number="form.minimumSubmissionInterval"
                :error-messages="form.errors.get('minimumSubmissionInterval')"
                hide-details="auto"
                :label="$t('surveys.submissionLimits.minInterval')"
                name="minimumSubmissionInterval"
                outlined
              />
            </v-col>
          </v-row>
          <v-divider class="my-6" />
          <v-row>
            <v-col cols="12" md>
              <div class="text-h5">
                {{ $t('surveys.externalComm._') }}
              </div>
              <v-switch
                v-model="form.allowGenUsers"
                class="my-6"
                :error-messages="form.errors.get('allowGenUsers')"
                hide-details="auto"
                :label="$t('surveys.externalComm.allowGenUsers')"
                name="allowGenUsers"
                @change="form.errors.clear('allowGenUsers')"
              />
              <v-text-field
                v-model="form.genUserKey"
                :append-icon="showGenUserKey ? 'fas fa-eye' : 'fas fa-eye-slash'"
                autocomplete="new-password"
                class="mb-4"
                :error-messages="form.errors.get('genUserKey')"
                hide-details="auto"
                :label="$t('surveys.externalComm.genUserKey')"
                name="genUserKey"
                outlined
                :type="showGenUserKey ? 'text' : 'password'"
                @click:append="showGenUserKey = !showGenUserKey"
              />
              <event-notifications
                v-model="form.notifications"
                :error-messages="form.errors.get('notifications')"
                name="notifications"
                @input="form.errors.clear('notifications')"
              />
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mdAndUp ? `auto` : '12'">
              <v-divider :vertical="$vuetify.breakpoint.mdAndUp" />
            </v-col>
            <v-col cols="12" md>
              <div class="text-h5 mb-4">
                {{ $t('surveys.session._') }}
              </div>
              <v-switch
                v-model="form.storeUserSessionOnServer"
                class="my-6"
                :error-messages="form.errors.get('storeUserSessionOnServer')"
                hide-details="auto"
                :label="$t('surveys.session.storeOnServer')"
                name="storeUserSessionOnServer"
                @change="form.errors.clear('storeUserSessionOnServer')"
              />
              <v-text-field
                v-model="form.sessionLifetime"
                :error-messages="form.errors.get('sessionLifetime')"
                hide-details="auto"
                :hint="$t('surveys.session.lifetime.hint')"
                :label="$t('surveys.session.lifetime._')"
                name="sessionLifetime"
                outlined
                prepend-inner-icon="fas fa-stopwatch"
              />
            </v-col>
          </v-row>
          <v-divider class="my-6" />
          <div class="text-h5 mb-4">
            {{ $t('surveys.feedback._') }}
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <select-resource
                v-model="form.feedbackSchemeId"
                clearable
                :error-messages="form.errors.get('feedbackSchemeId')"
                :initial-item="entry.feedbackScheme"
                :label="$t('feedback-schemes._')"
                name="feedbackSchemeId"
                resource="feedback-schemes"
                @input="form.errors.clear('feedbackSchemeId')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.numberOfSubmissionsForFeedback"
                :disabled="!form.feedbackSchemeId"
                :error-messages="form.errors.get('numberOfSubmissionsForFeedback')"
                hide-details="auto"
                :label="$t('surveys.feedback.numberOfSubmissions')"
                name="numberOfSubmissionsForFeedback"
                outlined
              />
            </v-col>
          </v-row>
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { Notification } from '@intake24/common/types';
import type { SurveyEntry } from '@intake24/common/types/http/admin';
import { EventNotifications, SelectResource } from '@intake24/admin/components/dialogs';
import { formMixin } from '@intake24/admin/components/entry';
import { DatePicker } from '@intake24/admin/components/forms';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import {
  defaultSearchSettings,
  type SchemeOverrides,
  type SearchSettings,
  type SurveyState,
} from '@intake24/common/surveys';
import { defaultOverrides, searchSortingAlgorithms, surveyStates } from '@intake24/common/surveys';

export type SurveyForm = {
  id: string | null;
  slug: string | null;
  name: string | null;
  state: SurveyState;
  localeId: string | null;
  surveySchemeId: string | null;
  feedbackSchemeId: string | null;
  startDate: string | null;
  endDate: string | null;
  supportEmail: string | null;
  suspensionReason: string | null;
  sessionLifetime: string;
  storeUserSessionOnServer: boolean;
  numberOfSubmissionsForFeedback: number;
  notifications: Notification[];
  /*
  surveyMonkeyUrl: string | null;
  originatingUrl: string | null;
   */
  allowGenUsers: boolean;
  genUserKey: string | null;
  authCaptcha: boolean;
  authUrlDomainOverride: string | null;
  authUrlTokenCharset: string | null;
  authUrlTokenLength: number | null;
  maximumDailySubmissions: number;
  maximumTotalSubmissions: number | null;
  minimumSubmissionInterval: number;
  searchSettings: SearchSettings;
  surveySchemeOverrides: SchemeOverrides;
  userPersonalIdentifiers: boolean;
  userCustomFields: boolean;
};

export const surveyForm: SurveyForm = {
  id: null,
  slug: null,
  name: null,
  state: 'notStarted',
  localeId: null,
  surveySchemeId: null,
  feedbackSchemeId: null,
  startDate: null,
  endDate: null,
  supportEmail: null,
  suspensionReason: null,
  sessionLifetime: '12h',
  storeUserSessionOnServer: false,
  numberOfSubmissionsForFeedback: 1,
  notifications: [],
  /* surveyMonkeyUrl: null,
  originatingUrl: null, */
  allowGenUsers: false,
  genUserKey: null,
  authCaptcha: false,
  authUrlDomainOverride: null,
  authUrlTokenCharset: null,
  authUrlTokenLength: null,
  maximumDailySubmissions: 3,
  maximumTotalSubmissions: null,
  minimumSubmissionInterval: 600,
  searchSettings: defaultSearchSettings,
  surveySchemeOverrides: defaultOverrides,
  userPersonalIdentifiers: false,
  userCustomFields: false,
};

export default defineComponent({
  name: 'SurveyForm',

  components: { DatePicker, EventNotifications, SelectResource },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, isEdit } = useEntry<SurveyEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<SurveyForm, SurveyEntry>(props, {
      data: surveyForm,
      editMethod: 'patch',
    });

    return {
      entry,
      entryLoaded,
      isEdit,
      clearError,
      form,
      routeLeave,
      submit,
    };
  },

  data() {
    return {
      showGenUserKey: false,
      surveyStates: surveyStates.map(value => ({
        value,
        text: this.$t(`surveys.states.${value}`),
      })),
      searchSortingAlgorithms: searchSortingAlgorithms.map(value => ({
        value,
        text: this.$t(`surveys.search.algorithms.${value}`),
      })),
    };
  },

  watch: {
    'form.allowGenUsers': {
      handler(val) {
        if (!val)
          this.showGenUserKey = false;
      },
    },
  },
});
</script>

<style lang="scss" scoped></style>
