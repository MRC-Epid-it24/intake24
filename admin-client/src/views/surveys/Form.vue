<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded" @save="onSubmit">
    <v-form @keydown.native="clearError" @submit.prevent="onSubmit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.id"
                :disabled="isEdit"
                :error-messages="form.errors.get('id')"
                :label="$t('surveys._')"
                hide-details="auto"
                name="id"
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
                  <span :class="`flag-icon flag-icon-${item.countryFlagCode} mr-3`"></span>
                  {{ item.englishName }}
                </template>
                <template v-slot:selection="{ item }">
                  <span :class="`flag-icon flag-icon-${item.countryFlagCode} mr-3`"></span>
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
              <v-menu
                ref="startDate"
                v-model="menus.startDate"
                :close-on-content-click="false"
                :return-value.sync="form.startDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.startDate"
                    :error-messages="form.errors.get('startDate')"
                    :label="$t('surveys.startDate')"
                    hide-details="auto"
                    name="startDate"
                    outlined
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.startDate"
                  name="startDate"
                  no-title
                  scrollable
                  @input="form.errors.clear('startDate')"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menus.startDate = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.startDate.save(form.startDate)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu> </v-col
            ><v-col cols="12" md="6">
              <v-menu
                ref="endDate"
                v-model="menus.endDate"
                :close-on-content-click="false"
                :return-value.sync="form.endDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="form.endDate"
                    :error-messages="form.errors.get('endDate')"
                    :label="$t('surveys.endDate')"
                    hide-details="auto"
                    outlined
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.endDate"
                  name="endDate"
                  no-title
                  scrollable
                  @input="form.errors.clear('endDate')"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menus.endDate = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.endDate.save(form.endDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
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
                :items="states"
                :label="$t('surveys.state._')"
                hide-details="auto"
                name="state"
                outlined
                @change="form.errors.clear('state')"
              ></v-select>
            </v-col>
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
                :disabled="!form.allowGenUsers"
                :error-messages="form.errors.get('genUserKey')"
                :label="$t('surveys.genUsers.secret')"
                hide-details="auto"
                name="genUserKey"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
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
            <v-col cols="12">
              <hr class="my-5" />
              <div class="text-h6">{{ $t('surveys.submissionLimits._') }}</div>
            </v-col>
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
            <v-col cols="12">
              <hr class="my-5" />
              <div class="text-h6">{{ $t('surveys.feedback._') }}</div>
            </v-col>
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
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-container>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import formMixin from '@/components/entry/formMixin';
import Form from '@/helpers/Form';

export default Vue.extend({
  name: 'SurveyForm',

  mixins: [formMixin],

  data() {
    return {
      menus: { startDate: false, endDate: false },
      form: new Form({
        id: null,
        state: 0,
        localeId: null,
        schemeId: null,
        startDate: null,
        endDate: null,
        supportEmail: null,
        allowGenUsers: false,
        genUserKey: null,
        feedbackEnabled: false,
        numberOfSubmissionsForFeedback: 1,
        storeUserSessionOnServer: false,
        description: null,
        finalPageHtml: null,
        maximumDailySubmissions: 3,
        maximumTotalSubmissions: null,
        minimumSubmissionInterval: 600,
      }),
      states: [
        { value: 0, text: this.$t('surveys.state.0') },
        { value: 1, text: this.$t('surveys.state.1') },
        { value: 2, text: this.$t('surveys.state.2') },
      ],
    };
  },
});
</script>

<style lang="scss" scoped></style>
