<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row justify="center" :no-gutters="isMobile">
      <v-col cols="auto">
        <v-card
          :class="{ 'mt-10': !isMobile }"
          :flat="isMobile"
          :tile="isMobile"
          :loading="loading"
          max-width="32rem"
        >
          <v-sheet class="d-flex justify-center" color="deep-orange lighten-5" tile>
            <v-card-title>
              <h2>{{ $t('login.title') }}</h2>
            </v-card-title>
          </v-sheet>
          <v-card-text class="pa-6">
            <p>Thank you for choosing to take part in this study!</p>
            <p>Please click on the 'Generate access' button generate new credentials for you.</p>
            <p>
              This survey will take approximately 30 minutes to complete. If you would like to be
              able to stop filling out the survey and resume at a later time, please write down
              generated credentials.
            </p>
            <v-btn
              v-if="!status"
              block
              class="my-5"
              color="deep-orange"
              dark
              x-large
              @click="generateUser"
            >
              {{ $t('survey.generateUser._') }}
            </v-btn>
            <template v-if="status">
              <v-sheet v-if="status === 200" class="pa-5 my-5" color="deep-orange lighten-5">
                <h4 class="my-2">{{ $t('common.username') }}: {{ username }}</h4>
                <h4 class="my-2">{{ $t('common.password') }}: {{ password }}</h4>
              </v-sheet>
              <v-alert v-else type="error" dark>
                {{ $t(`survey.generateUser.${status}`, { surveyId: survey?.name ?? surveyId }) }}
              </v-alert>
            </template>
            <p>
              If you close your browser window you can get back to your survey using the following
              <router-link :to="{ name: 'survey-login', params: { surveyId } }">link</router-link>.
            </p>
            <p>
              If you think you will be able to complete the survey in one sitting, please ignore
              this and continue.
            </p>
            <v-card-actions class="px-0">
              <v-btn block color="secondary" xLarge :disabled="!canContinue" @click="login">
                {{ $t('common.action.continue') }}
              </v-btn>
            </v-card-actions>
            <template v-if="reCaptcha.enabled">
              <v-divider class="mt-4"></v-divider>
              <div class="pa-2 text-caption">
                <vue-recaptcha
                  ref="reCaptchaRef"
                  size="invisible"
                  :sitekey="reCaptcha.siteKey"
                  @verify="onCaptchaVerified"
                  @expired="onCaptchaExpired"
                >
                </vue-recaptcha>
                This site is protected by reCAPTCHA and the Google
                <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and
                <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a>
                apply.
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref, reactive } from '@vue/composition-api';
import VueRecaptcha from 'vue-recaptcha';
import { mapActions } from 'pinia';
import surveySvc from '@intake24/survey/services/survey.service';
import { useAuth } from '@intake24/survey/stores';
import type { PublicSurveyEntry } from '@intake24/common/types/http';

export default defineComponent({
  name: 'GenerateUser',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup() {
    const reCaptchaRef = ref<InstanceType<typeof VueRecaptcha>>();

    return reactive({
      loading: false,
      status: null as number | null,
      survey: null as PublicSurveyEntry | null,
      username: '',
      password: '',
      reCaptcha: {
        enabled: import.meta.env.VITE_APP_RECAPTCHA_ENABLED === 'true',
        siteKey: import.meta.env.VITE_APP_RECAPTCHA_SITEKEY,
        token: null as string | null,
      },
      reCaptchaRef,
    });
  },

  components: { VueRecaptcha },

  computed: {
    canContinue(): boolean {
      return this.status === 200;
    },
  },

  async mounted() {
    await this.fetchSurveyPublicInfo();

    if (this.survey?.openAccess === false) this.status = 403;
  },

  methods: {
    ...mapActions(useAuth, { userPassLogin: 'login' }),

    async fetchSurveyPublicInfo() {
      try {
        this.survey = await surveySvc.surveyPublicInfo(this.surveyId);
      } catch (err) {
        if (axios.isAxiosError(err)) this.status = err.response?.status ?? 0;
      }
    },

    resetReCaptcha() {
      this.reCaptcha.token = null;
      this.reCaptchaRef?.reset();
    },

    onCaptchaVerified(token: string) {
      this.reCaptcha.token = token;
      this.generateUser();
    },

    onCaptchaExpired() {
      this.resetReCaptcha();
    },

    async generateUser() {
      const { enabled, token } = this.reCaptcha;

      if (enabled && !token) {
        this.reCaptchaRef?.execute();
        return;
      }

      this.loading = true;

      try {
        const { username, password } = await surveySvc.generateUser(this.surveyId, {
          reCaptchaToken: token,
        });

        this.status = 200;
        this.username = username;
        this.password = password;
      } catch (err) {
        if (axios.isAxiosError(err)) this.status = err.response?.status ?? 0;
      } finally {
        this.loading = false;

        this.resetReCaptcha();
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
        if (axios.isAxiosError(err) && err.response?.status === 401)
          this.$toasted.error(this.$t('login.err.invalidCredentials').toString());
      }
    },
  },
});
</script>

<style lang="scss">
.grecaptcha-badge {
  visibility: hidden;
}
</style>
