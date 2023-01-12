<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <app-entry-screen :logo="logo" :title="$t('common._').toString()" width="30rem">
      <v-card-text class="pa-6">
        <p>Thank you for choosing to take part in this study!</p>
        <p>Click on the 'Generate access' button generate new credentials for you.</p>
        <p>
          This survey will take approximately 30 minutes to complete. If you would like to be able
          to stop filling out the survey and resume at a later time, write down generated
          credentials.
        </p>
        <v-btn v-if="!status" block class="my-5" color="secondary" rounded x-large @click="submit">
          {{ $t('survey.generateUser._') }}
        </v-btn>
        <template v-if="status">
          <v-sheet v-if="status === 200" class="pa-5 my-5" color="deep-orange lighten-5">
            <h4 class="my-2">{{ $t('common.username') }}: {{ username }}</h4>
            <h4 class="my-2">{{ $t('common.password') }}: {{ password }}</h4>
          </v-sheet>
          <v-alert v-else dark type="error">
            {{ $t(`survey.generateUser.${status}`, { surveyId: survey?.name ?? surveyId }) }}
          </v-alert>
        </template>
        <p>
          If you close your browser window you can get back to your survey using the following
          <router-link :to="{ name: 'survey-login', params: { surveyId } }">link</router-link>.
        </p>
        <p>
          If you think you will be able to complete the survey in one sitting, ignore this and
          continue.
        </p>
      </v-card-text>
      <v-card-actions class="px-6 pb-6">
        <v-btn block color="secondary" :disabled="!canContinue" rounded x-large @click="login">
          {{ $t('common.action.continue') }}
        </v-btn>
      </v-card-actions>
      <captcha ref="captchaRef" @expired="expired" @verified="verified"></captcha>
      <v-card-actions>
        <v-btn color="info" exact text :to="{ name: 'survey-login', params: { surveyId } }">
          <v-icon left>fas fa-angles-left</v-icon>
          {{ $t('common.login.back') }}
        </v-btn>
      </v-card-actions>
    </app-entry-screen>
  </v-container>
</template>

<script lang="ts">
import axios from 'axios';
import { mapActions } from 'pinia';
import { defineComponent, reactive, ref } from 'vue';

import type { PublicSurveyEntry } from '@intake24/common/types/http';
import { logo } from '@intake24/survey/assets';
import { surveyService } from '@intake24/survey/services';
import { useAuth, useMessages } from '@intake24/survey/stores';
import { AppEntryScreen, Captcha } from '@intake24/ui';

export default defineComponent({
  name: 'GenerateUser',

  components: { AppEntryScreen, Captcha },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup() {
    const captchaRef = ref<InstanceType<typeof Captcha>>();

    return reactive({
      loading: false,
      status: null as number | null,
      survey: null as PublicSurveyEntry | null,
      username: '',
      password: '',
      captcha: null as string | null,
      captchaRef,
      logo,
    });
  },

  computed: {
    canContinue(): boolean {
      return this.status === 200;
    },
  },

  async mounted() {
    await this.fetchSurveyPublicInfo();

    const { survey } = this;
    if (!survey) {
      this.status = 404;
      return;
    }

    if (survey.openAccess === false) this.status = 403;
  },

  methods: {
    ...mapActions(useAuth, { userPassLogin: 'login' }),

    async fetchSurveyPublicInfo() {
      try {
        this.survey = await surveyService.surveyPublicInfo(this.surveyId);
      } catch (err) {
        if (axios.isAxiosError(err)) this.status = err.response?.status ?? 0;
      }
    },

    resetCaptcha() {
      this.captcha = null;
      this.captchaRef?.reset();
    },

    async verified(token: string) {
      this.captcha = token;
      await this.generateUser();
    },

    expired() {
      this.resetCaptcha();
    },

    async generateUser() {
      const { captcha } = this;

      this.loading = true;

      try {
        const { username, password } = await surveyService.generateUser(this.surveyId, { captcha });

        this.status = 200;
        this.username = username;
        this.password = password;
      } catch (err) {
        if (axios.isAxiosError(err)) this.status = err.response?.status ?? 0;
      } finally {
        this.loading = false;

        this.resetCaptcha();
      }
    },

    async submit() {
      if (this.captchaRef) {
        this.captchaRef.executeIfCan();
        return;
      }

      await this.generateUser();
    },

    async login() {
      const { username, password, surveyId } = this;
      try {
        await this.userPassLogin({ username, password, survey: surveyId });
        this.username = '';
        this.password = '';
        await this.$router.push({ name: 'survey-home', params: { surveyId } });
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401)
          useMessages().error(this.$t('common.login.err.invalidCredentials').toString());
      }
    },
  },
});
</script>

<style lang="scss"></style>
