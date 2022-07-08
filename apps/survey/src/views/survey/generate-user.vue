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
          </v-card-text>
          <v-card-actions class="px-6 pb-6">
            <v-btn block color="secondary" xLarge :disabled="!canContinue" @click="login">
              {{ $t('common.action.continue') }}
            </v-btn>
          </v-card-actions>
          <div v-if="captcha.enabled">
            <v-divider class="mx-6 mt-3"></v-divider>
            <component
              :is="captcha.provider"
              :sitekey="captcha.sitekey"
              ref="captchaRef"
              @verified="verified"
              @expired="expired"
            ></component>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref, reactive } from 'vue';
import { mapActions } from 'pinia';
import surveySvc from '@intake24/survey/services/survey.service';
import { useAuth } from '@intake24/survey/stores';
import type { PublicSurveyEntry } from '@intake24/common/types/http';
import { HCaptcha, ReCaptcha } from '@intake24/ui';

export default defineComponent({
  name: 'GenerateUser',

  components: { HCaptcha, ReCaptcha },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup() {
    const captchaRef = ref<InstanceType<typeof HCaptcha | typeof ReCaptcha>>();

    return reactive({
      loading: false,
      status: null as number | null,
      survey: null as PublicSurveyEntry | null,
      username: '',
      password: '',
      captcha: {
        enabled: !!import.meta.env.VITE_APP_CAPTCHA_PROVIDER,
        provider: import.meta.env.VITE_APP_CAPTCHA_PROVIDER,
        sitekey: import.meta.env.VITE_APP_CAPTCHA_SITEKEY as string,
        token: null as string | null,
      },
      captchaRef,
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
        this.survey = await surveySvc.surveyPublicInfo(this.surveyId);
      } catch (err) {
        if (axios.isAxiosError(err)) this.status = err.response?.status ?? 0;
      }
    },

    resetCaptcha() {
      this.captcha.token = null;
      this.captchaRef?.reset();
    },

    async verified(token: string) {
      this.captcha.token = token;
      await this.generateUser();
    },

    expired() {
      this.resetCaptcha();
    },

    async generateUser() {
      const { enabled, token } = this.captcha;

      if (enabled && !token) {
        this.captchaRef?.execute();
        return;
      }

      this.loading = true;

      try {
        const { username, password } = await surveySvc.generateUser(this.surveyId, {
          captcha: token,
        });

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

<style lang="scss"></style>
