<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row justify="center" :no-gutters="isMobile">
      <v-col cols="auto">
        <v-card :class="{ 'mt-10': !isMobile }" :flat="isMobile" :tile="isMobile" max-width="32rem">
          <v-sheet class="d-flex justify-center flex-column" color="deep-orange lighten-5" tile>
            <div class="text-center text-h2 font-weight-medium py-2">
              {{ $t('common._') }}
            </div>
            <div class="text-center py-2">
              {{ survey ? survey.name : surveyId }}
            </div>
          </v-sheet>
          <v-card-subtitle class="text-center">
            {{ $t('login.subtitle') }}
          </v-card-subtitle>
          <v-form
            @keydown.native="errors.clear($event.target.name)"
            @submit.prevent="login"
            :disabled="invalidSurvey"
          >
            <v-card-text class="px-6">
              <v-row>
                <v-col cols="12" class="mb-3">
                  <v-text-field
                    v-model="username"
                    :error-messages="errors.get('username')"
                    :label="$t('common.username')"
                    autocomplete="username"
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
                    autocomplete="current-password"
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
          <v-card-text v-if="isOpenAccess" class="px-6 d-flex flex-column">
            <v-divider></v-divider>
            <v-card-subtitle>{{ $t('survey.generateUser.subtitle') }}</v-card-subtitle>
            <v-btn color="accent" :to="{ name: 'survey-generate-user', params: { surveyId } }">
              {{ $t('survey.generateUser._') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import type { AxiosError } from 'axios';
import axios from 'axios';
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import type { PublicSurveyEntry } from '@intake24/common/types/http';
import { Errors } from '@intake24/common/util';
import surveySvc from '@intake24/survey/services/survey.service';
import { useAuth } from '@intake24/survey/stores';

export default defineComponent({
  name: 'SurveyLogin',

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
        this.survey = await surveySvc.surveyPublicInfo(this.surveyId);
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
