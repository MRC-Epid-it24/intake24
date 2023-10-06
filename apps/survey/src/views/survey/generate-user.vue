<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <app-entry-screen :title="$t('common._').toString()" width="30rem">
      <v-form @keydown.native="errors.clear($event.target.name)" @submit.prevent="login">
        <v-card-text class="pa-6">
          <p>{{ $t('survey.generateUser.info1') }}</p>
          <p>{{ $t('survey.generateUser.info2') }}</p>
          <v-btn v-if="!status" block class="my-5" color="primary" rounded x-large @click="submit">
            {{ $t('survey.generateUser._') }}
          </v-btn>
          <template v-if="status">
            <v-card v-if="status === 200" class="pa-5 my-5" outlined>
              <v-text-field
                autocomplete="username"
                :error-messages="errors.get('username')"
                hide-details="auto"
                :label="$t('common.username')"
                name="username"
                outlined
                prepend-inner-icon="fas fa-user"
                readonly
                required
                :value="username"
              >
              </v-text-field>
              <v-text-field
                :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                autocomplete="current-password"
                class="mt-4"
                :error-messages="errors.get('password')"
                hide-details="auto"
                :label="$t('common.password')"
                name="password"
                outlined
                prepend-inner-icon="fas fa-key"
                readonly
                required
                :type="showPassword ? 'text' : 'password'"
                :value="password"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-card>
            <v-alert v-else dark type="error">
              {{ $t(`survey.generateUser.${status}`, { surveyId: survey?.name ?? surveyId }) }}
            </v-alert>
          </template>
          <i18n path="survey.generateUser.info3" tag="p">
            <template #action>
              <router-link :to="{ name: 'survey-login', params: { surveyId } }">
                {{ $t('survey.generateUser.link') }}
              </router-link>
            </template>
          </i18n>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn block color="primary" :disabled="!canContinue" rounded type="submit" x-large>
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-card-actions>
      </v-form>
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
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router/composables';

import { surveyService } from '@intake24/survey/services';
import { AppEntryScreen, Captcha } from '@intake24/ui';

import { useLogin } from './use-login';

export default defineComponent({
  name: 'GenerateUser',

  components: { AppEntryScreen, Captcha },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();
    const {
      errors,
      fetchSurveyPublicInfo,
      login,
      password,
      showPassword,
      status,
      survey,
      username,
    } = useLogin(props);

    showPassword.value = true;

    const captchaRef = ref<InstanceType<typeof Captcha>>();
    const captchaToken = ref<string | null>(null);
    const loading = ref(false);

    const canContinue = computed(() => status.value === 200);

    onMounted(async () => {
      await fetchSurveyPublicInfo();
      if (survey.value?.openAccess !== true) await router.push({ name: 'home' });
    });

    return {
      canContinue,
      captchaRef,
      captchaToken,
      errors,
      fetchSurveyPublicInfo,
      loading,
      login,
      password,
      showPassword,
      status,
      survey,
      username,
    };
  },

  methods: {
    resetCaptcha() {
      this.captchaToken = null;
      this.captchaRef?.reset();
    },

    async verified(token: string) {
      this.captchaToken = token;
      await this.generateUser();
    },

    expired() {
      this.resetCaptcha();
    },

    async generateUser() {
      const { captchaToken } = this;

      this.loading = true;

      try {
        const { username, password } = await surveyService.generateUser(this.surveyId, {
          captcha: captchaToken,
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

    async submit() {
      if (this.captchaRef) {
        this.captchaRef.executeIfCan();
        return;
      }

      await this.generateUser();
    },
  },
});
</script>

<style lang="scss"></style>
