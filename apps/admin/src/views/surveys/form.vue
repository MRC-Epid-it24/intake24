<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit" autocomplete="off">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.slug"
                :disabled="isEdit"
                :error-messages="form.errors.get('slug')"
                :label="$t('surveys.id')"
                hide-details="auto"
                name="slug"
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
                :label="$t('locales._')"
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
                v-model="form.surveySchemeId"
                :error-messages="form.errors.get('surveySchemeId')"
                :items="refs.surveySchemes"
                :label="$t('survey-schemes._')"
                hide-details="auto"
                item-value="id"
                item-text="name"
                name="surveySchemeId"
                outlined
                @change="form.errors.clear('surveySchemeId')"
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
          <div class="text-h5 mb-4">{{ $t('surveys.users._') }}</div>
          <v-row>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.userPersonalIdentifiers"
                :error-messages="form.errors.get('userPersonalIdentifiers')"
                :label="$t('surveys.users.personalIdentifiers')"
                class="mt-0"
                hide-details="auto"
                name="userPersonalIdentifiers"
                @change="form.errors.clear('userPersonalIdentifiers')"
              ></v-switch>
              <v-switch
                v-model="form.userCustomFields"
                :error-messages="form.errors.get('userCustomFields')"
                :label="$t('surveys.users.customFields')"
                hide-details="auto"
                name="userCustomFields"
                @change="form.errors.clear('userCustomFields')"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.allowGenUsers"
                :error-messages="form.errors.get('allowGenUsers')"
                :label="$t('surveys.users.allowGenUsers')"
                class="mt-0"
                hide-details="auto"
                name="allowGenUsers"
                @change="form.errors.clear('allowGenUsers')"
              ></v-switch>
              <v-text-field
                v-model="form.genUserKey"
                :append-icon="showGenUserKey ? 'fa-eye' : 'fa-eye-slash'"
                :disabled="!form.allowGenUsers"
                :error-messages="form.errors.get('genUserKey')"
                :label="$t('surveys.users.genUserKey')"
                :type="showGenUserKey ? 'text' : 'password'"
                autocomplete="new-password"
                class="mt-4"
                hide-details="auto"
                name="genUserKey"
                outlined
                @click:append="showGenUserKey = !showGenUserKey"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="my-6"></v-divider>
          <div class="text-h5 mb-4">{{ $t('surveys.search._') }}</div>
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
          <div class="text-h5 mb-4">{{ $t('surveys.authUrl._') }}</div>
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
          <div class="text-h5 mb-4">{{ $t('surveys.submissionLimits._') }}</div>
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
          <div class="text-h5 mb-4">{{ $t('surveys.feedback._') }}</div>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.feedbackSchemeId"
                :error-messages="form.errors.get('feedbackSchemeId')"
                :items="availableFeedbackSchemes"
                :label="$t('feedback-schemes._')"
                hide-details="auto"
                item-value="id"
                item-text="name"
                name="feedbackSchemeId"
                outlined
                @change="form.errors.clear('feedbackSchemeId')"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.numberOfSubmissionsForFeedback"
                outlined
                :disabled="!form.feedbackSchemeId"
                :error-messages="form.errors.get('numberOfSubmissionsForFeedback')"
                :label="$t('surveys.feedback.numberOfSubmissions')"
                name="numberOfSubmissionsForFeedback"
                hide-details="auto"
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
import Vue, { VueConstructor } from 'vue';
import {
  searchSortingAlgorithms,
  SearchSortingAlgorithm,
  surveyStates,
  SurveyState,
} from '@intake24/common/types/models';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';
import { FormMixin } from '@intake24/admin/types';
import { SurveyEntry, SurveyRefs } from '@intake24/common/types/http/admin';
import { defaultOverrides, SchemeOverrides } from '@intake24/common/schemes';

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
  authUrlDomainOverride: null,
  authUrlTokenCharset: null,
  authUrlTokenLength: null,
  maximumDailySubmissions: 3,
  maximumTotalSubmissions: null,
  minimumSubmissionInterval: 600,
  searchSortingAlgorithm: 'paRules',
  searchMatchScoreWeight: 20,
  surveySchemeOverrides: defaultOverrides,
  userPersonalIdentifiers: false,
  userCustomFields: false,
};

type FeedbackSchemeListEntry = { id: string | null; name: string };

export default (Vue as VueConstructor<Vue & FormMixin<SurveyEntry, SurveyRefs>>).extend({
  name: 'SurveyForm',

  mixins: [formMixin],

  data() {
    return {
      menus: { startDate: false, endDate: false },
      editMethod: 'patch',
      form: form<SurveyForm>(surveyForm),
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

  computed: {
    availableFeedbackSchemes(): FeedbackSchemeListEntry[] {
      if (!this.refsLoaded) return [];

      return [{ id: null, name: 'None' }, ...this.refs.feedbackSchemes];
    },
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
