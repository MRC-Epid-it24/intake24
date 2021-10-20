<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-card class="mt-10" outlined raised max-width="30rem">
        <v-sheet class="d-flex justify-center" color="deep-orange lighten-5" tile>
          <v-card-title>
            <h2>{{ $t('common._') }}</h2>
          </v-card-title>
        </v-sheet>

        <v-card-subtitle class="text-center">
          {{ $t('login.subtitle') }}
        </v-card-subtitle>
        <v-form
          @keydown.native="errors.clear($event.target.name)"
          @submit.prevent="onLogin"
          :disabled="invalidSurvey"
        >
          <v-card-text class="px-6">
            <v-row>
              <v-col cols="12" class="mb-3">
                <v-text-field
                  v-model="userName"
                  :error-messages="errors.get('userName')"
                  :label="$t('common.username')"
                  hide-details="auto"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mb-3">
                <v-text-field
                  v-model="password"
                  :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                  :error-messages="errors.get('password')"
                  :label="$t('common.password')"
                  :type="showPassword ? 'text' : 'password'"
                  hide-details="auto"
                  required
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-6 pb-6">
            <v-btn :disabled="invalidSurvey" type="submit" color="secondary" xLarge width="100%">
              {{ $t('common.login') }}
            </v-btn>
          </v-card-actions>
        </v-form>
        <v-card-text v-if="status" class="px-6">
          <v-alert v-if="invalidCredentials" border="left" outlined type="error">
            {{ $t('login.err.invalidCredentials') }}
          </v-alert>
          <v-alert v-if="invalidSurvey" border="left" outlined type="error">
            <p>{{ $t('login.err.invalidSurvey', { surveyId }) }}</p>
            <p class="mb-0">{{ $t('login.err.checkCredentials') }}</p>
          </v-alert>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios';
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { PublicSurveyEntryResponse } from '@common/types/http';
import { Errors } from '@common/util';
import surveySvc from '@/services/survey.service';

export default Vue.extend({
  name: 'Login',

  props: {
    surveyId: {
      type: String,
    },
  },

  data() {
    return {
      userName: '',
      password: '',
      showPassword: false,
      status: null as number | null,
      survey: null as PublicSurveyEntryResponse | null,
      errors: new Errors(),
    };
  },

  computed: {
    ...mapGetters('auth', ['loggedIn']),

    invalidCredentials(): boolean {
      return this.status === 401;
    },

    invalidSurvey(): boolean {
      return this.status === 404;
    },

    surveyLoaded(): boolean {
      return !!this.survey;
    },
  },

  async mounted() {
    const {
      name,
      params: { token },
    } = this.$route;

    await this.fetchSurveyPublicInfo();

    if (!this.loggedIn) {
      try {
        await this.$store.dispatch('auth/refresh');

        const { surveyId } = this.$route.params;
        await this.$router.push({ name: 'survey-dashboard', params: { surveyId } });
      } catch (err) {
        // continue
      }
      return;
    }

    if (name === 'survey-login-token') {
      try {
        await this.token({ token });
        await this.$router.push({ name: 'survey-dashboard', params: { surveyId: this.surveyId } });
        return;
      } catch (err) {
        if (axios.isAxiosError(err)) this.status = err.response?.status ?? 0;
      }
    }
  },

  methods: {
    ...mapActions('auth', ['login', 'token']),

    async fetchSurveyPublicInfo() {
      try {
        this.survey = await surveySvc.surveyPublicInfo(this.surveyId);
      } catch (err) {
        if (axios.isAxiosError(err)) this.status = err.response?.status ?? 0;
      }
    },

    async onLogin() {
      const { userName, password, surveyId } = this;
      try {
        await this.login({ userName, password, surveyId });
        this.userName = '';
        this.password = '';
        await this.$router.push({ name: 'survey-dashboard', params: { surveyId } });
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
