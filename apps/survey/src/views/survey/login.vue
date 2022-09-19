<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <app-entry-screen
      :logo="logo"
      :subtitle="$t('common.login.subtitle').toString()"
      :title="$t('common._').toString()"
      width="30rem"
    >
      <v-form
        :disabled="invalidSurvey"
        @keydown.native="errors.clear($event.target.name)"
        @submit.prevent="login"
      >
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="username"
                  autocomplete="username"
                  :error-messages="errors.get('username')"
                  hide-details="auto"
                  :label="$t('common.username')"
                  name="username"
                  outlined
                  prepend-inner-icon="fas fa-user"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                  autocomplete="current-password"
                  :error-messages="errors.get('password')"
                  hide-details="auto"
                  :label="$t('common.password')"
                  name="password"
                  outlined
                  prepend-inner-icon="fas fa-key"
                  required
                  :type="showPassword ? 'text' : 'password'"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12">
                <v-btn
                  block
                  color="secondary"
                  :disabled="invalidSurvey"
                  rounded
                  type="submit"
                  x-large
                >
                  {{ $t('common.login._') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-form>
      <v-card-text v-if="status" class="px-6">
        <v-alert v-if="invalidCredentials" border="left" outlined type="error">
          {{ $t('common.login.err.invalidCredentials') }}
        </v-alert>
        <v-alert v-if="invalidSurvey" border="left" outlined type="error">
          <p>{{ $t('common.login.err.invalidSurvey', { surveyId }) }}</p>
          <p class="mb-0">{{ $t('common.login.err.checkCredentials') }}</p>
        </v-alert>
      </v-card-text>
      <template v-if="isOpenAccess">
        <v-divider class="mx-6"></v-divider>
        <v-card-title class="text-h3 font-weight-medium justify-center">
          {{ `No account?` }}
        </v-card-title>
        <v-card-subtitle class="d-flex justify-center font-weight-medium px-6 pt-4">
          {{ $t('survey.generateUser.subtitle') }}
        </v-card-subtitle>
        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-col cols="12">
                <v-btn
                  block
                  color="accent"
                  outlined
                  rounded
                  :to="{ name: 'survey-generate-user', params: { surveyId } }"
                  x-large
                >
                  {{ $t('survey.generateUser._') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </template>
    </app-entry-screen>
  </v-container>
</template>

<script lang="ts">
import type { AxiosError } from 'axios';
import axios from 'axios';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { PublicSurveyEntry } from '@intake24/common/types/http';
import { Errors } from '@intake24/common/util';
import { logo } from '@intake24/survey/assets';
import { surveyService } from '@intake24/survey/services';
import { useAuth } from '@intake24/survey/stores';
import { AppEntryScreen } from '@intake24/ui';

export default defineComponent({
  name: 'SurveyLogin',

  components: { AppEntryScreen },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      status: null as number | null,
      survey: null as PublicSurveyEntry | null,
      errors: new Errors(),
      logo,
    };
  },

  computed: {
    ...mapState(useAuth, ['loggedIn']),

    invalidCredentials(): boolean {
      return this.status === 401;
    },

    invalidSurvey(): boolean {
      return this.status === 404;
    },

    isOpenAccess(): boolean {
      return !!this.survey?.openAccess;
    },
  },

  async mounted() {
    const { surveyId } = this;

    await this.fetchSurveyPublicInfo();

    if (this.invalidSurvey) return;

    if (!this.loggedIn) {
      try {
        await this.refresh();
        await this.$router.push({ name: 'survey-home', params: { surveyId } });
      } catch (err) {
        // continue
      }
    }
  },

  methods: {
    ...mapActions(useAuth, { userPassLogin: 'login', refresh: 'refresh' }),

    async fetchSurveyPublicInfo() {
      try {
        this.survey = await surveyService.surveyPublicInfo(this.surveyId);
      } catch (err) {
        if (axios.isAxiosError(err)) this.status = err.response?.status ?? 0;
      }
    },

    async login() {
      const { username, password, surveyId } = this;
      try {
        await this.userPassLogin({ username, password, survey: surveyId });
        this.username = '';
        this.password = '';
        await this.$router.push({ name: 'survey-home', params: { surveyId } });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const { response: { status = 0, data = {} } = {} } = err as AxiosError<any>;
          this.status = status;

          if (status === 422 && 'errors' in data) this.errors.record(data.errors);
        }
      }
    },
  },
});
</script>

<style lang="scss"></style>
