<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mt-10" outlined raised max-width="30rem">
          <v-sheet class="d-flex justify-center" color="deep-orange lighten-5" tile>
            <v-card-title>
              <h2>{{ $t('login.title') }}</h2>
            </v-card-title>
          </v-sheet>
          <v-card-text v-if="status === 404" class="px-5 py-10">
            <v-alert border="left" color="error" dark>
              <p>{{ $t('login.err.invalidSurvey', { surveyId }) }}</p>
              <p>{{ $t('login.err.checkCredentials') }}</p>
            </v-alert>
          </v-card-text>
          <v-card-text v-if="surveyLoaded">
            <v-card-subtitle class="text-center">
              {{ $t('login.subtitle') }}
            </v-card-subtitle>
            <v-form @submit.prevent="onLogin">
              <v-row>
                <v-col cols="12" class="mb-3">
                  <v-text-field
                    v-model="userName"
                    :label="$t('common.username')"
                    hide-details="auto"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-3">
                  <v-text-field
                    v-model="password"
                    :label="$t('common.password')"
                    hide-details="auto"
                    type="password"
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
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import surveySvc from '@/services/survey.service';
import { SurveyPublicParametersResponse } from '@common/types/http';

export default Vue.extend({
  name: 'Login',

  data() {
    const { surveyId } = this.$route.params;

    return {
      userName: '',
      password: '',
      surveyId,
      status: null as number | null,
      survey: {} as SurveyPublicParametersResponse,
    };
  },

  computed: {
    surveyLoaded(): boolean {
      return !!Object.keys(this.survey).length;
    },
  },

  async mounted() {
    const {
      name,
      params: { surveyId, token },
    } = this.$route;

    if (name === 'token') {
      try {
        await this.token({ token });
        await this.$router.push({ name: 'recall', params: { surveyId } });
        return;
      } catch (err) {
        if (err.response?.status === 401)
          this.$toasted.error(this.$t('login.err.invalidToken') as string);
      }
    }

    try {
      this.survey = await surveySvc.surveyPublicInfo(this.surveyId);
    } catch (err) {
      this.status = err.response?.status;
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
        await this.$router.push({ name: 'recall', params: { surveyId } });
      } catch (err) {
        if (err.response?.status === 401)
          this.$toasted.error(this.$t('login.err.invalidCredentials') as string);
      }
    },
  },
});
</script>

<style lang="scss"></style>
