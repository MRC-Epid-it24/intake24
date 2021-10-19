<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-card class="mt-10" outlined raised max-width="30rem">
        <v-sheet class="d-flex justify-center" color="deep-orange lighten-5" tile>
          <v-card-title>
            <h2>{{ $t('login.title') }}</h2>
          </v-card-title>
        </v-sheet>
        <v-card-text v-if="status === 404" class="px-6 py-10">
          <v-alert border="left" color="error" dark>
            <p>{{ $t('login.err.invalidSurvey', { surveyId }) }}</p>
            <p>{{ $t('login.err.checkCredentials') }}</p>
          </v-alert>
        </v-card-text>
        <v-card-text v-if="surveyLoaded" class="px-6">
          <v-card-subtitle class="text-center">
            {{ $t('login.subtitle') }}
          </v-card-subtitle>
          <v-form @keydown.native="errors.clear($event.target.name)" @submit.prevent="onLogin">
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
            <v-card-actions class="px-0">
              <v-btn type="submit" color="secondary" xLarge width="100%">
                {{ $t('common.login') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios';
import Vue from 'vue';
import { mapActions } from 'vuex';
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
    surveyLoaded(): boolean {
      return !!this.survey;
    },
  },

  async mounted() {
    const {
      name,
      params: { token },
    } = this.$route;

    if (name === 'login-token') {
      try {
        await this.token({ token });
        await this.$router.push({ name: 'dashboard', params: { surveyId: this.surveyId } });
        return;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401)
          this.$toasted.error(this.$t('login.err.invalidToken').toString());
      }
    }

    try {
      this.survey = await surveySvc.surveyPublicInfo(this.surveyId);
    } catch (err) {
      if (axios.isAxiosError(err)) this.status = err.response?.status ?? 0;
    }
  },

  methods: {
    ...mapActions('auth', ['login', 'token']),

    async onLogin() {
      const { userName, password, surveyId } = this;
      try {
        await this.login({ userName, password, surveyId });
        this.userName = '';
        this.password = '';
        await this.$router.push({ name: 'dashboard', params: { surveyId } });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const { response: { status, data = {} } = {} } = err as AxiosError<any>;

          if (status === 422 && 'errors' in data) this.errors.record(data.errors);

          if (status === 401)
            this.$toasted.error(this.$t('login.err.invalidCredentials').toString());
        }
      }
    },
  },
});
</script>

<style lang="scss"></style>
