<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <v-container fluid>
      <v-form autocomplete="off" @keydown="clearError" @submit.prevent="submit">
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
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('surveys.name')"
                name="name"
                variant="outlined"
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
                @update:model-value="form.errors.clear('localeId')"
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
                @update:model-value="form.errors.clear('surveySchemeId')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <date-picker
                v-model="form.startDate"
                :error-messages="form.errors.get('startDate')"
                :label="$t('surveys.startDate')"
                @change="form.errors.clear('startDate')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <date-picker
                v-model="form.endDate"
                :error-messages="form.errors.get('endDate')"
                :label="$t('surveys.endDate')"
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
                prepend-inner-icon="fas fa-envelope"
                variant="outlined"
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
                prepend-inner-icon="fas fa-spinner"
                variant="outlined"
                @update:model-value="form.errors.clear('state')"
              />
            </v-col>
            <v-col v-show="form.state === 'suspended'" cols="12">
              <v-text-field
                v-model="form.suspensionReason"
                :error-messages="form.errors.get('suspensionReason')"
                hide-details="auto"
                :label="$t('surveys.suspensionReason')"
                name="suspensionReason"
                variant="outlined"
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
                @update:model-value="form.errors.clear('searchSettings.collectData')"
              />
              <v-slider
                v-model.number="form.searchSettings.maxResults"
                class="mt-7"
                :error-messages="form.errors.get('searchSettings.maxResults')"
                hide-details="auto"
                :label="$t('surveys.search.maxResults')"
                max="100"
                min="10"
                name="seachMaxResults"
                thumb-label="always"
              />
              <div class="text-h6 mb-6 mt-6 underline">
                {{ $t('surveys.search.sorting') }}
              </div>
              <div class="mt-4">
                <v-icon
                  @click="showInformationPopup('sortingAlgorithmInfo')"
                >
                  fas fa-circle-question
                </v-icon>
                <v-label class="ml-2">
                  {{ $t('surveys.search.sortingAlgorithm') }}
                </v-label>
              </div>
              <v-select
                v-model="form.searchSettings.sortingAlgorithm"
                class="mt-2"
                density="compact"
                :error-messages="form.errors.get('searchSettings.sortingAlgorithm')"
                hide-details="auto"
                :items="searchSortingAlgorithms"
                name="searchSortingAlgorithm"
                prepend-inner-icon="fas fa-arrow-up-wide-short"
                variant="outlined"
                @update:model-value="form.errors.clear('searchSettings.sortingAlgorithm')"
              />
              <div class="mt-4">
                <v-icon
                  @click="showInformationPopup('matchScoreWeightInfo')"
                >
                  fas fa-circle-question
                </v-icon>
                <v-label class="ml-2">
                  {{ $t('surveys.search.matchScoreWeight') }}
                </v-label>
              </div>
              <v-slider
                v-model.number="form.searchSettings.matchScoreWeight"
                :error-messages="form.errors.get('searchSettings.matchScoreWeight')"
                hide-details="auto"
                max="100"
                min="0"
                name="searchMatchScoreWeight"
                step="1"
                thumb-label
              >
                <template #prepend>
                  <v-list-subheader>{{ $t('surveys.search.foodOrdering') }}</v-list-subheader>
                </template>
                <template #append>
                  <v-list-subheader>{{ $t('surveys.search.matchQuality') }}</v-list-subheader>
                </template>
              </v-slider>
              <div class="text-h6 mb-10 mt-4 underline">
                <v-icon
                  class="mr-3"
                  @click="showInformationPopup('matchQualityInfo')"
                >
                  fas fa-circle-question
                </v-icon>{{ $t('surveys.search.matchQualityCriteria') }}
              </div>
              <v-slider
                v-model.number="form.searchSettings.firstWordCost"
                class="mt-7"
                :error-messages="form.errors.get('searchSettings.firstWordCost')"
                hide-details="auto"
                :label="$t('surveys.search.firstWordCost')"
                max="20"
                min="0"
                name="searchFirstWordCost"
                thumb-label="always"
              />
              <v-slider
                v-model.number="form.searchSettings.wordOrderCost"
                class="mt-7"
                :error-messages="form.errors.get('searchSettings.wordOrderCost')"
                hide-details="auto"
                :label="$t('surveys.search.wordOrderCost')"
                max="10"
                min="0"
                name="searchWordOrderCost"
                thumb-label="always"
              />
              <v-slider
                v-model.number="form.searchSettings.wordDistanceCost"
                class="mt-7"
                :error-messages="form.errors.get('searchSettings.wordDistanceCost')"
                hide-details="auto"
                :label="$t('surveys.search.wordDistanceCost')"
                max="10"
                min="0"
                name="searchWordDistanceCost"
                thumb-label="always"
              />
              <v-slider
                v-model.number="form.searchSettings.unmatchedWordCost"
                class="mt-7"
                :error-messages="form.errors.get('searchSettings.unmatchedWordCost')"
                hide-details="auto"
                :label="$t('surveys.search.unmatchedWordCost')"
                max="10"
                min="0"
                name="searchUnmatchedWordCost"
                thumb-label="always"
              />
              <div class="text-h6 mb-4 mt-4 underline">
                <v-icon
                  class="mr-3"
                  @click="showInformationPopup('spellingCorrectionInfo')"
                >
                  fas fa-circle-question
                </v-icon>{{ $t('surveys.search.spellingCorrection') }}
              </div>
              <v-switch
                v-model="form.searchSettings.enableEditDistance"
                class="mt-6"
                :error-messages="form.errors.get('searchSettings.enableEditDistance')"
                hide-details="auto"
                :label="$t('surveys.search.enableEditDistance')"
                name="searchEnableEditDistance"
                @update:model-value="form.errors.clear('searchSettings.enableEditDistance')"
              />
              <v-slider
                v-model.number="form.searchSettings.minWordLength1"
                class="mt-6"
                :error-messages="form.errors.get('searchSettings.minWordLength1')"
                hide-details="auto"
                :label="$t('surveys.search.minWordLength1')"
                max="10"
                min="2"
                name="searchMinWordLength1"
                thumb-label="always"
              />
              <v-slider
                v-model.number="form.searchSettings.minWordLength2"
                class="mt-6"
                :error-messages="form.errors.get('searchSettings.minWordLength2')"
                hide-details="auto"
                :label="$t('surveys.search.minWordLength2')"
                max="10"
                min="3"
                name="searchMinWordLength2"
                thumb-label="always"
              />
              <v-switch
                v-model="form.searchSettings.enablePhonetic"
                class="my-6"
                :error-messages="form.errors.get('searchSettings.enablePhonetic')"
                hide-details="auto"
                :label="$t('surveys.search.enablePhonetic')"
                name="searchEnablePhonetic"
                @update:model-value="form.errors.clear('searchSettings.enablePhonetic')"
              />
              <v-slider
                v-model.number="form.searchSettings.minWordLengthPhonetic"
                class="mt-0 mb-6"
                :error-messages="form.errors.get('searchSettings.minWordLengthPhonetic')"
                hide-details="auto"
                :label="$t('surveys.search.minWordLengthPhonetic')"
                max="10"
                min="2"
                name="searchMinWordLengthPhonetic"
                thumb-label="always"
              />
              <v-label>
                {{ $t('surveys.search.spellingCorrectionPreference') }}
              </v-label>
              <v-select
                v-model="form.searchSettings.spellingCorrectionPreference"
                class="mt-2"
                density="compact"
                :error-messages="form.errors.get('searchSettings.spellingCorrectionPreference')"
                hide-details="auto"
                :items="spellingCorrectionOptions"
                name="searchSpellingCorrectionPreference"
                prepend-inner-icon="fas fa-arrow-up-wide-short"
                variant="outlined"
                @update:model-value="form.errors.clear('searchSettings.spellingCorrectionPreference')"
              />
              <div class="text-h6 mb-4 mt-4 underline">
                <v-icon
                  class="mr-3"
                  @click="showInformationPopup('relevantCategoriesInfo')"
                >
                  fas fa-circle-question
                </v-icon>{{ $t('surveys.search.relevantCategories') }}
              </div>
              <v-switch
                v-model="form.searchSettings.enableRelevantCategories"
                class="mt-6"
                :error-messages="form.errors.get('searchSettings.enableRelevantCategories')"
                hide-details="auto"
                :label="$t('surveys.search.enableRelevantCategories')"
                name="searchEnableRelevantCategories"
                @update:model-value="form.errors.clear('searchSettings.enableRelevantCategories')"
              />
              <v-slider
                v-model.number="form.searchSettings.relevantCategoryDepth"
                class="mt-8"
                :error-messages="form.errors.get('searchSettings.relevantCategoryDepth')"
                hide-details="auto"
                :label="$t('surveys.search.relevantCategoryDepth')"
                max="5"
                min="0"
                name="searchRelevantCategoryDepth"
                thumb-label="always"
              />
              <information-popup v-if="infoComponentType" :component-type="`${infoComponentType}`" :open="infoPopupOpen" :title="$t(`surveys.search.information.${infoComponentType}.title`)" @close="hideInformationPopup" />
            </v-col>
            <v-col :cols="$vuetify.display.mdAndUp ? `auto` : '12'">
              <v-divider :vertical="$vuetify.display.mdAndUp" />
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
                @update:model-value="form.errors.clear('userPersonalIdentifiers')"
              />
              <v-switch
                v-model="form.userCustomFields"
                :error-messages="form.errors.get('userCustomFields')"
                hide-details="auto"
                :label="$t('surveys.users.customFields')"
                name="userCustomFields"
                @update:model-value="form.errors.clear('userCustomFields')"
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
                @update:model-value="form.errors.clear('authCaptcha')"
              />
              <v-text-field
                v-model="form.authUrlTokenCharset"
                class="mb-4"
                :error-messages="form.errors.get('authUrlTokenCharset')"
                hide-details="auto"
                :label="$t('surveys.auth.urlTokenCharset')"
                name="authUrlTokenCharset"
                prepend-inner-icon="fas fa-font"
                variant="outlined"
              />
              <v-text-field
                v-model.number="form.authUrlTokenLength"
                class="mb-4"
                :error-messages="form.errors.get('authUrlTokenLength')"
                hide-details="auto"
                :label="$t('surveys.auth.urlTokenLength')"
                name="authUrlTokenLength"
                prepend-inner-icon="fas fa-ruler-horizontal"
                variant="outlined"
              />
              <v-text-field
                v-model="form.authUrlDomainOverride"
                :error-messages="form.errors.get('authUrlDomainOverride')"
                hide-details="auto"
                :label="$t('surveys.auth.urlDomainOverride')"
                name="authUrlDomainOverride"
                prepend-inner-icon="fas fa-up-right-from-square"
                variant="outlined"
              />
            </v-col>
            <v-col :cols="$vuetify.display.mdAndUp ? `auto` : '12'">
              <v-divider :vertical="$vuetify.display.mdAndUp" />
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
                variant="outlined"
              />
              <v-text-field
                v-model.number="form.maximumTotalSubmissions"
                class="mb-4"
                :error-messages="form.errors.get('maximumTotalSubmissions')"
                hide-details="auto"
                :label="$t('surveys.submissionLimits.maxTotal')"
                name="maximumTotalSubmissions"
                variant="outlined"
              />
              <v-text-field
                v-model.number="form.minimumSubmissionInterval"
                :error-messages="form.errors.get('minimumSubmissionInterval')"
                hide-details="auto"
                :label="$t('surveys.submissionLimits.minInterval')"
                name="minimumSubmissionInterval"
                variant="outlined"
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
                @update:model-value="form.errors.clear('allowGenUsers')"
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
                :type="showGenUserKey ? 'text' : 'password'"
                variant="outlined"
                @click:append="showGenUserKey = !showGenUserKey"
              />
              <event-notifications
                v-model="form.notifications"
                :error-messages="form.errors.get('notifications')"
                name="notifications"
                @update:model-value="form.errors.clear('notifications')"
              />
            </v-col>
            <v-col :cols="$vuetify.display.mdAndUp ? `auto` : '12'">
              <v-divider :vertical="$vuetify.display.mdAndUp" />
            </v-col>
            <v-col cols="12" md>
              <div class="text-h5 mb-4">
                {{ $t('surveys.session._') }}
              </div>
              <v-switch
                v-model="form.session.store"
                class="my-6"
                :error-messages="form.errors.get('session.store')"
                hide-details="auto"
                :label="$t('surveys.session.store')"
                name="session.store"
                @update:model-value="form.errors.clear('session.store')"
              />
              <v-text-field
                v-model="form.session.age"
                class="mb-4"
                :error-messages="form.errors.get('session.age')"
                hide-details="auto"
                :hint="$t('surveys.session.age.hint')"
                :label="$t('surveys.session.age._')"
                name="session.age"
                prepend-inner-icon="fas fa-stopwatch"
                variant="outlined"
              />
              <v-text-field
                v-model="form.session.fixed"
                :error-messages="form.errors.get('session.fixed')"
                hide-details="auto"
                :hint="$t('surveys.session.fixed.hint')"
                :label="$t('surveys.session.fixed._')"
                name="session.fixed"
                prepend-inner-icon="fas fa-stopwatch"
                variant="outlined"
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
                @update:model-value="form.errors.clear('feedbackSchemeId')"
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
                variant="outlined"
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
import { defineComponent, ref } from 'vue';

import type { Notification } from '@intake24/common/types';
import type { SurveyEntry } from '@intake24/common/types/http/admin';
import { EventNotifications, SelectResource } from '@intake24/admin/components/dialogs';
import InformationPopup from '@intake24/admin/components/dialogs/information-popup.vue';
import { formMixin } from '@intake24/admin/components/entry';
import { DatePicker } from '@intake24/admin/components/forms';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import {
  defaultSearchSettings,
  defaultSessionSettings,
  type SchemeOverrides,
  type SessionSettings,
  spellingCorrectionPreferences,
  type SurveySearchSettings,
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
  session: SessionSettings;
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
  searchSettings: SurveySearchSettings;
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
  session: defaultSessionSettings,
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

  components: { InformationPopup, DatePicker, EventNotifications, SelectResource },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, isEdit } = useEntry<SurveyEntry>(props);

    const infoComponentType = ref(undefined as string | undefined);
    const infoPopupOpen = ref(false);

    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<SurveyForm, SurveyEntry>(props, {
      data: surveyForm,
      editMethod: 'patch',
    });

    const showInformationPopup = (type: string) => {
      infoComponentType.value = `${type}`;
      infoPopupOpen.value = true;
    };

    const hideInformationPopup = () => {
      infoPopupOpen.value = false;
    };

    const matchScoreWeightTickLabels = ['Sorting data', 'Match score'];

    return {
      entry,
      entryLoaded,
      isEdit,
      clearError,
      form,
      routeLeave,
      submit,
      showInformationPopup,
      hideInformationPopup,
      infoComponentType,
      infoPopupOpen,
      matchScoreWeightTickLabels,
    };
  },

  data() {
    return {
      showGenUserKey: false,
      surveyStates: surveyStates.map(value => ({
        value,
        title: this.$t(`surveys.states.${value}`),
      })),
      searchSortingAlgorithms: searchSortingAlgorithms.map(value => ({
        value,
        title: this.$t(`surveys.search.algorithms.${value}`),
      })),
      spellingCorrectionOptions: spellingCorrectionPreferences.map(value => ({
        value,
        title: this.$t(`surveys.search.spellingCorrectionOptions.${value}`),
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

<style lang="scss" scoped>
.underline {
  border-bottom: 1px solid lightgray;
}
</style>
