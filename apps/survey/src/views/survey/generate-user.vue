<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-card class="mt-10" outlined raised max-width="30rem" :loading="loading">
        <v-sheet class="d-flex justify-center" color="deep-orange lighten-5" tile>
          <v-card-title>
            <h2>{{ $t('login.title') }}</h2>
          </v-card-title>
        </v-sheet>
        <v-card-text class="pa-6">
          <p>Thank you for choosing to take part in this study!</p>
          <p>Please click on the 'Generate access' button generate new credentials for you.</p>
          <p>
            This survey will take approximately 30 minutes to complete. If you would like to be able
            to stop filling out the survey and resume at a later time, please write down generated
            credentials.
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
          <v-sheet v-if="status === 200" class="pa-5 my-5" color="deep-orange lighten-5">
            <h4 class="my-2">{{ $t('common.username') }}: {{ userName }}</h4>
            <h4 class="my-2">{{ $t('common.password') }}: {{ password }}</h4>
          </v-sheet>
          <v-alert v-if="status === 403" type="error" dark>
            {{ $t('survey.generateUser.403', { surveyId }) }}
          </v-alert>
          <v-alert v-if="status === 404" type="error" dark>
            {{ $t('survey.generateUser.404', { surveyId }) }}
          </v-alert>
          <v-alert v-if="status === 422" type="error" dark>
            {{ $t('survey.generateUser.422') }}
          </v-alert>
          <v-alert v-if="status === 429" type="error" dark>
            {{ $t('survey.generateUser.429') }}
          </v-alert>
          <p>
            If you close your browser window you can get back to your survey using the following
            <a :href="`/${surveyId}`">link</a>.
          </p>
          <p>
            If you think you will be able to complete the survey in one sitting, please ignore this
            and continue.
          </p>
          <v-card-actions class="px-0">
            <v-btn block color="secondary" xLarge :disabled="!canContinue" @click="onLogin">
              {{ $t('common.action.continue') }}
            </v-btn>
          </v-card-actions>
          <template v-if="reCaptcha.enabled">
            <v-divider class="mt-4"></v-divider>
            <div class="pa-2 text-caption">
              <vue-recaptcha
                ref="reCaptcha"
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
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref, reactive } from '@vue/composition-api';
import VueRecaptcha from 'vue-recaptcha';
import { mapActions } from 'pinia';
import surveySvc from '@intake24/survey/services/survey.service';
import { useAuth } from '@intake24/survey/stores';

export default defineComponent({
  name: 'GenerateUser',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup() {
    const reCaptcha = ref<InstanceType<typeof VueRecaptcha>>();

    return reactive({
      loading: false,
      status: null as number | null,
      userName: '',
      password: '',
      reCaptcha: {
        ref: reCaptcha,
        enabled: process.env.VUE_APP_RECAPTCHA_ENABLED === 'true',
        siteKey: process.env.VUE_APP_RECAPTCHA_SITEKEY,
        token: null as string | null,
      },
    });
  },

  components: { VueRecaptcha },

  /* data() {
    return {
      loading: false,
      status: null as number | null,
      userName: '',
      password: '',
      reCaptcha: {
        ref
        settings: {
          enabled: process.env.VUE_APP_RECAPTCHA_ENABLED === 'true',
          siteKey: process.env.VUE_APP_RECAPTCHA_SITEKEY,
        },
        token: null as string | null,
      },
    };
  }, */

  computed: {
    canContinue(): boolean {
      return this.status === 200;
    },
  },

  methods: {
    ...mapActions(useAuth, ['login']),

    resetReCaptcha() {
      this.reCaptcha.token = null;
      this.reCaptcha.ref?.reset();
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
        this.reCaptcha.ref?.execute();
        return;
      }

      this.loading = true;

      try {
        const { userName, password } = await surveySvc.generateUser(this.surveyId, {
          reCaptchaToken: token,
        });

        this.status = 200;
        this.userName = userName;
        this.password = password;
      } catch (err) {
        if (axios.isAxiosError(err)) this.status = err.response?.status ?? 0;
      } finally {
        this.loading = false;

        this.resetReCaptcha();
      }
    },

    async onLogin() {
      const { userName, password, surveyId } = this;
      try {
        await this.login({ userName, password, surveyId });
        this.userName = '';
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
