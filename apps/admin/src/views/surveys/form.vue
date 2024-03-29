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
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('surveys.name')"
                name="name"
                outlined
              ></v-text-field>
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
              >
              </select-resource>
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
              >
              </select-resource>
            </v-col>
            <v-col cols="12" md="6">
              <date-picker
                v-model="form.startDate"
                :error-messages="form.errors.get('startDate')"
                :label="$t('surveys.startDate').toString()"
                @change="form.errors.clear('startDate')"
              ></date-picker>
            </v-col>
            <v-col cols="12" md="6">
              <date-picker
                v-model="form.endDate"
                :error-messages="form.errors.get('endDate')"
                :label="$t('surveys.endDate').toString()"
                @change="form.errors.clear('endDate')"
              ></date-picker>
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
              ></v-text-field>
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
              ></v-select>
            </v-col>
            <v-col v-show="form.state === 'suspended'" cols="12">
              <v-text-field
                v-model="form.suspensionReason"
                :error-messages="form.errors.get('suspensionReason')"
                hide-details="auto"
                :label="$t('surveys.suspensionReason')"
                name="suspensionReason"
                outlined
              ></v-text-field>
            </v-col>
            <v-col align-self="center" cols="12" md="6">
              <v-switch
                v-model="form.storeUserSessionOnServer"
                class="mt-0"
                :error-messages="form.errors.get('storeUserSessionOnServer')"
                hide-details="auto"
                :label="$t('surveys.storeUserSessionOnServer')"
                name="storeUserSessionOnServer"
                @change="form.errors.clear('storeUserSessionOnServer')"
              ></v-switch>
            </v-col>
          </v-row>
          <v-divider class="my-6"></v-divider>
          <v-row>
            <v-col cols="12" md>
              <div class="text-h5 mb-4">{{ $t('surveys.search._') }}</div>
              <v-select
                v-model="form.searchSortingAlgorithm"
                :error-messages="form.errors.get('searchSortingAlgorithm')"
                hide-details="auto"
                :items="searchSortingAlgorithms"
                :label="$t('surveys.search.sortingAlgorithm')"
                name="searchSortingAlgorithm"
                outlined
                prepend-inner-icon="fas fa-arrow-up-wide-short"
                @change="form.errors.clear('searchSortingAlgorithm')"
              ></v-select>
              <v-slider
                v-model.number="form.searchMatchScoreWeight"
                class="mt-10"
                :error-messages="form.errors.get('searchMatchScoreWeight')"
                hide-details="auto"
                :label="$t('surveys.search.matchScoreWeight')"
                max="100"
                min="0"
                name="searchMatchScoreWeight"
                thumb-label="always"
              ></v-slider>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mdAndUp ? `auto` : '12'">
              <v-divider :vertical="$vuetify.breakpoint.mdAndUp"></v-divider>
            </v-col>
            <v-col cols="12" md>
              <div class="text-h5 mb-4">{{ $t('surveys.users._') }}</div>
              <v-switch
                v-model="form.userPersonalIdentifiers"
                :error-messages="form.errors.get('userPersonalIdentifiers')"
                hide-details="auto"
                :label="$t('surveys.users.personalIdentifiers')"
                name="userPersonalIdentifiers"
                @change="form.errors.clear('userPersonalIdentifiers')"
              ></v-switch>
              <v-switch
                v-model="form.userCustomFields"
                :error-messages="form.errors.get('userCustomFields')"
                hide-details="auto"
                :label="$t('surveys.users.customFields')"
                name="userCustomFields"
                @change="form.errors.clear('userCustomFields')"
              ></v-switch>
            </v-col>
          </v-row>
          <v-divider class="my-6"></v-divider>
          <v-row>
            <v-col cols="12" md>
              <div class="text-h5 mb-4">{{ $t('surveys.auth._') }}</div>
              <v-switch
                v-model="form.authCaptcha"
                class="my-6"
                :error-messages="form.errors.get('authCaptcha')"
                hide-details="auto"
                :label="$t('surveys.auth.captcha')"
                name="authCaptcha"
                @change="form.errors.clear('authCaptcha')"
              ></v-switch>
              <v-text-field
                v-model="form.authUrlTokenCharset"
                class="mb-4"
                :error-messages="form.errors.get('authUrlTokenCharset')"
                hide-details="auto"
                :label="$t('surveys.auth.urlTokenCharset')"
                name="authUrlTokenCharset"
                outlined
              ></v-text-field>
              <v-text-field
                v-model.number="form.authUrlTokenLength"
                class="mb-4"
                :error-messages="form.errors.get('authUrlTokenLength')"
                hide-details="auto"
                :label="$t('surveys.auth.urlTokenLength')"
                name="authUrlTokenLength"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="form.authUrlDomainOverride"
                :error-messages="form.errors.get('authUrlDomainOverride')"
                hide-details="auto"
                :label="$t('surveys.auth.urlDomainOverride')"
                name="authUrlDomainOverride"
                outlined
                prepend-inner-icon="fas fa-up-right-from-square"
              ></v-text-field>
            </v-col>
            <v-col :cols="$vuetify.breakpoint.mdAndUp ? `auto` : '12'">
              <v-divider :vertical="$vuetify.breakpoint.mdAndUp"></v-divider>
            </v-col>
            <v-col cols="12" md>
              <div class="text-h5">{{ $t('surveys.externalComm._') }}</div>
              <v-switch
                v-model="form.allowGenUsers"
                class="my-6"
                :error-messages="form.errors.get('allowGenUsers')"
                hide-details="auto"
                :label="$t('surveys.externalComm.allowGenUsers')"
                name="allowGenUsers"
                @change="form.errors.clear('allowGenUsers')"
              ></v-switch>
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
              ></v-text-field>
              <v-text-field
                v-model="form.submissionNotificationUrl"
                autocomplete="off"
                :error-messages="form.errors.get('submissionNotificationUrl')"
                hide-details="auto"
                :label="$t('surveys.externalComm.submissionNotificationUrl')"
                name="submissionNotificationUrl"
                outlined
                prepend-inner-icon="fas fa-up-right-from-square"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="my-6"></v-divider>
          <div class="text-h5 mb-4">{{ $t('surveys.submissionLimits._') }}</div>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.maximumDailySubmissions"
                :error-messages="form.errors.get('maximumDailySubmissions')"
                hide-details="auto"
                :label="$t('surveys.submissionLimits.maxDaily')"
                name="maximumDailySubmissions"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.maximumTotalSubmissions"
                :error-messages="form.errors.get('maximumTotalSubmissions')"
                hide-details="auto"
                :label="$t('surveys.submissionLimits.maxTotal')"
                name="maximumTotalSubmissions"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.minimumSubmissionInterval"
                :error-messages="form.errors.get('minimumSubmissionInterval')"
                hide-details="auto"
                :label="$t('surveys.submissionLimits.minInterval')"
                name="minimumSubmissionInterval"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="my-6"></v-divider>
          <div class="text-h5 mb-4">{{ $t('surveys.feedback._') }}</div>
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
              >
              </select-resource>
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
              ></v-text-field>
            </v-col>
          </v-row>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type {
  SchemeOverrides,
  SearchSortingAlgorithm,
  SurveyState,
} from '@intake24/common/surveys';
import type { SurveyEntry } from '@intake24/common/types/http/admin';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { formMixin } from '@intake24/admin/components/entry';
import { DatePicker } from '@intake24/admin/components/forms';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
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
  storeUserSessionOnServer: boolean;
  numberOfSubmissionsForFeedback: number;
  submissionNotificationUrl: string | null;
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
  searchSortingAlgorithm: SearchSortingAlgorithm;
  searchMatchScoreWeight: number;
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
  storeUserSessionOnServer: false,
  numberOfSubmissionsForFeedback: 1,
  submissionNotificationUrl: null,
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
  searchSortingAlgorithm: 'popularity',
  searchMatchScoreWeight: 20,
  surveySchemeOverrides: defaultOverrides,
  userPersonalIdentifiers: false,
  userCustomFields: false,
};

export default defineComponent({
  name: 'SurveyForm',

  components: { DatePicker, SelectResource },

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
      surveyStates: surveyStates.map((value) => ({
        value,
        text: this.$t(`surveys.states.${value}`),
      })),
      searchSortingAlgorithms: searchSortingAlgorithms.map((value) => ({
        value,
        text: this.$t(`surveys.search.algorithms.${value}`),
      })),
    };
  },

  watch: {
    'form.allowGenUsers': {
      handler(val) {
        if (!val) this.showGenUserKey = false;
      },
    },
  },
});
</script>

<style lang="scss" scoped></style>
