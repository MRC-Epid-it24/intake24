<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit" autocomplete="off">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :disabled="isEdit"
                :error-messages="form.errors.get('id')"
                :label="$t('surveys.id')"
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                :label="$t('surveys.name')"
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.localeId"
                :items="refs.locales"
                :error-messages="form.errors.get('localeId')"
                :label="$t('surveys.locale')"
                hide-details="auto"
                item-value="id"
                item-text="englishName"
                name="localeId"
                outlined
                @change="form.errors.clear('localeId')"
              >
                <template v-slot:item="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
                <template v-slot:selection="{ item }">
                  <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.schemeId"
                :error-messages="form.errors.get('schemeId')"
                :items="refs.schemes"
                :label="$t('surveys.scheme')"
                hide-details="auto"
                item-value="id"
                item-text="name"
                name="schemeId"
                outlined
                @change="form.errors.clear('schemeId')"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-dialog
                ref="startDate"
                v-model="menus.startDate"
                :return-value.sync="form.startDate"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.startDate"
                    :error-messages="form.errors.get('startDate')"
                    :label="$t('surveys.startDate')"
                    hide-details="auto"
                    outlined
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.startDate"
                  scrollable
                  @change="form.errors.clear('startDate')"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menus.startDate = false">
                    {{ $t('common.action.cancel') }}
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.startDate.save(form.startDate)">
                    {{ $t('common.action.ok') }}
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="12" md="6">
              <v-dialog
                ref="endDate"
                v-model="menus.endDate"
                :return-value.sync="form.endDate"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.endDate"
                    :error-messages="form.errors.get('endDate')"
                    :label="$t('surveys.endDate')"
                    hide-details="auto"
                    outlined
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.endDate"
                  scrollable
                  @change="form.errors.clear('endDate')"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menus.endDate = false">
                    {{ $t('common.action.cancel') }}
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.endDate.save(form.endDate)">
                    {{ $t('common.action.ok') }}
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.supportEmail"
                :error-messages="form.errors.get('supportEmail')"
                :label="$t('surveys.supportEmail')"
                hide-details="auto"
                name="supportEmail"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.state"
                :error-messages="form.errors.get('state')"
                :items="surveyStates"
                :label="$t('surveys.states._')"
                hide-details="auto"
                name="state"
                outlined
                @change="form.errors.clear('state')"
              ></v-select>
            </v-col>
            <v-col cols="12" v-show="form.state === 2">
              <v-text-field
                v-model="form.suspensionReason"
                :error-messages="form.errors.get('suspensionReason')"
                :label="$t('surveys.suspensionReason')"
                hide-details="auto"
                name="suspensionReason"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" align-self="center">
              <v-switch
                v-model="form.storeUserSessionOnServer"
                :error-messages="form.errors.get('storeUserSessionOnServer')"
                :label="$t('surveys.storeUserSessionOnServer')"
                class="mt-0"
                hide-details="auto"
                name="storeUserSessionOnServer"
                @change="form.errors.clear('storeUserSessionOnServer')"
              ></v-switch>
            </v-col>
          </v-row>
          <template v-if="can('surveyadmin')">
            <v-divider class="my-6"></v-divider>
            <div class="text-h6 mb-4">{{ $t('surveys.genUsers._') }}</div>
            <v-row>
              <v-col cols="12" md="6" align-self="center">
                <v-switch
                  v-model="form.allowGenUsers"
                  :error-messages="form.errors.get('allowGenUsers')"
                  :label="$t('surveys.genUsers.allow')"
                  class="mt-0"
                  hide-details="auto"
                  name="allowGenUsers"
                  @change="form.errors.clear('allowGenUsers')"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.genUserKey"
                  :append-icon="showGenUserKey ? 'fa-eye' : 'fa-eye-slash'"
                  :disabled="!form.allowGenUsers"
                  :error-messages="form.errors.get('genUserKey')"
                  :label="$t('surveys.genUsers.secret')"
                  :type="showGenUserKey ? 'text' : 'password'"
                  hide-details="auto"
                  name="genUserKey"
                  outlined
                  @click:append="showGenUserKey = !showGenUserKey"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.submissionNotificationUrl"
                  :error-messages="form.errors.get('submissionNotificationUrl')"
                  :label="$t('surveys.submissionNotificationUrl')"
                  hide-details="auto"
                  name="submissionNotificationUrl"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="my-6"></v-divider>
            <div class="text-h6 mb-4">{{ $t('surveys.search._') }}</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.searchSortingAlgorithm"
                  :error-messages="form.errors.get('searchSortingAlgorithm')"
                  :items="searchSortingAlgorithms"
                  :label="$t('surveys.search.sortingAlgorithm')"
                  hide-details="auto"
                  name="searchSortingAlgorithm"
                  outlined
                  @change="form.errors.clear('searchSortingAlgorithm')"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" align-self="center">
                <v-slider
                  v-model.number="form.searchMatchScoreWeight"
                  :error-messages="form.errors.get('searchMatchScoreWeight')"
                  :label="$t('surveys.search.matchScoreWeight')"
                  hide-details="auto"
                  max="100"
                  min="0"
                  name="searchMatchScoreWeight"
                  thumb-label
                ></v-slider>
              </v-col>
            </v-row>
            <v-divider class="my-6"></v-divider>
            <div class="text-h6 mb-4">{{ $t('surveys.authUrl._') }}</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.authUrlTokenCharset"
                  :error-messages="form.errors.get('authUrlTokenCharset')"
                  :label="$t('surveys.authUrl.tokenCharset')"
                  hide-details="auto"
                  name="authUrlTokenCharset"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.authUrlTokenLength"
                  :error-messages="form.errors.get('authUrlTokenLength')"
                  :label="$t('surveys.authUrl.tokenLength')"
                  hide-details="auto"
                  name="authUrlTokenLength"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.authUrlDomainOverride"
                  :error-messages="form.errors.get('authUrlDomainOverride')"
                  :label="$t('surveys.authUrl.domainOverride')"
                  hide-details="auto"
                  name="authUrlDomainOverride"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="my-6"></v-divider>
            <div class="text-h6 mb-4">{{ $t('surveys.submissionLimits._') }}</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.maximumDailySubmissions"
                  outlined
                  :error-messages="form.errors.get('maximumDailySubmissions')"
                  :label="$t('surveys.submissionLimits.maxDaily')"
                  name="maximumDailySubmissions"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.maximumTotalSubmissions"
                  outlined
                  :error-messages="form.errors.get('maximumTotalSubmissions')"
                  :label="$t('surveys.submissionLimits.maxTotal')"
                  name="maximumTotalSubmissions"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.minimumSubmissionInterval"
                  outlined
                  :error-messages="form.errors.get('minimumSubmissionInterval')"
                  :label="$t('surveys.submissionLimits.minInterval')"
                  name="minimumSubmissionInterval"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="my-6"></v-divider>
            <div class="text-h6 mb-4">{{ $t('surveys.feedback._') }}</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="form.feedbackEnabled"
                  :error-messages="form.errors.get('feedbackEnabled')"
                  :label="$t('surveys.feedback.enabled')"
                  hide-details="auto"
                  name="feedbackEnabled"
                  @change="form.errors.clear('feedbackEnabled')"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.feedbackStyle"
                  :disabled="!form.feedbackEnabled"
                  :error-messages="form.errors.get('feedbackStyle')"
                  :items="feedbackStyles"
                  :label="$t('surveys.feedback.styles._')"
                  hide-details="auto"
                  name="feedbackStyle"
                  outlined
                  @change="form.errors.clear('feedbackStyle')"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.numberOfSubmissionsForFeedback"
                  outlined
                  :disabled="!form.feedbackEnabled"
                  :error-messages="form.errors.get('numberOfSubmissionsForFeedback')"
                  :label="$t('surveys.feedback.numberOfSubmissions')"
                  name="numberOfSubmissionsForFeedback"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { SchemeOverrides, defaultOverrides } from '@intake24/common/schemes';
import {
  searchSortingAlgorithms,
  SearchSortingAlgorithm,
  surveyStates,
  SurveyState,
  staffUpdateSurveyFields,
  StaffUpdateSurveyFields,
} from '@intake24/common/types/models';
import { pick } from 'lodash';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';

export type SurveyForm = {
  id: string | null;
  name: string | null;
  state: SurveyState;
  localeId: string | null;
  schemeId: string | null;
  startDate: string | null;
  endDate: string | null;
  supportEmail: string | null;
  suspensionReason: string | null;
  /*
  surveyMonkeyUrl: string | null;
  originatingUrl: string | null;
  description: string | null;
  finalPageHtml: string | null;
   */
  allowGenUsers: boolean;
  genUserKey: string | null;
  authUrlDomainOverride: string | null;
  authUrlTokenCharset: string | null;
  authUrlTokenLength: number | null;
  storeUserSessionOnServer: boolean;
  feedbackEnabled: boolean;
  feedbackStyle: string;
  submissionNotificationUrl: string | null;
  numberOfSubmissionsForFeedback: number;
  maximumDailySubmissions: number;
  maximumTotalSubmissions: number | null;
  minimumSubmissionInterval: number;
  searchSortingAlgorithm: SearchSortingAlgorithm;
  searchMatchScoreWeight: number;
  overrides: SchemeOverrides;
};

export type StaffSurveyForm = Pick<SurveyForm, StaffUpdateSurveyFields>;

export const surveyForm: SurveyForm = {
  id: null,
  name: null,
  state: 0,
  localeId: null,
  schemeId: null,
  startDate: null,
  endDate: null,
  supportEmail: null,
  suspensionReason: null,
  /* surveyMonkeyUrl: null,
  originatingUrl: null,
  description: null,
  finalPageHtml: null, */
  allowGenUsers: false,
  genUserKey: null,
  authUrlDomainOverride: null,
  authUrlTokenCharset: null,
  authUrlTokenLength: null,
  storeUserSessionOnServer: false,
  feedbackEnabled: false,
  feedbackStyle: 'default',
  submissionNotificationUrl: null,
  numberOfSubmissionsForFeedback: 1,
  maximumDailySubmissions: 3,
  maximumTotalSubmissions: null,
  minimumSubmissionInterval: 600,
  searchSortingAlgorithm: 'paRules',
  searchMatchScoreWeight: 20,
  overrides: defaultOverrides,
};

export const staffSurveyForm: StaffSurveyForm = pick(surveyForm, staffUpdateSurveyFields);

export default Vue.extend({
  name: 'SurveyForm',

  mixins: [formMixin],

  data() {
    return {
      menus: { startDate: false, endDate: false },
      /* form: this.can('surveyadmin')
        ? form<SurveyForm>(surveyForm)
        : form<StaffSurveyForm>(staffSurveyForm), */
      editMethod: 'patch',
      form: form<SurveyForm>(surveyForm),
      showGenUserKey: false,
      surveyStates: Object.values(surveyStates).map((value) => ({
        value,
        text: this.$t(`surveys.states.${value}`),
      })),
      searchSortingAlgorithms: searchSortingAlgorithms.map((value) => ({
        value,
        text: this.$t(`surveys.search.algorithms.${value}`),
      })),
      feedbackStyles: ['default'].map((value) => ({
        value,
        text: this.$t(`surveys.feedback.styles.${value}`),
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
