<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <app-entry-screen
      :subtitle="$t('common.login.captcha').toString()"
      :title="$t('common._').toString()"
    >
      <v-form @keydown.native="errors.clear($event.target.name)" @submit.prevent="submit">
        <v-card-text class="d-flex flex-column justify-center align-center">
          <v-icon class="pt-8 pb-12" size="96">fas fa-robot</v-icon>
          <v-btn block color="primary" rounded type="submit" x-large>
            {{ $t('common.login.start') }}
          </v-btn>
        </v-card-text>
        <captcha ref="captchaEl" @expired="expired" @verified="verified"></captcha>
      </v-form>
    </app-entry-screen>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import { AppEntryScreen, Captcha } from '@intake24/ui';

import { useLogin } from './use-login';

export default defineComponent({
  name: 'SurveyChallenge',

  components: { AppEntryScreen, Captcha },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();
    const route = useRoute();

    const {
      captchaEl,
      captchaToken,
      errors,
      fetchSurveyPublicInfo,
      login,
      resetCaptcha,
      status,
      survey,
      token,
    } = useLogin(props);

    const verified = async (token?: string) => {
      captchaToken.value = token;
      await login('token');
    };

    const expired = () => {
      resetCaptcha();
    };

    const submit = async () => {
      if (captchaEl.value) {
        captchaEl.value.executeIfCan();
        return;
      }

      await login('token');
    };

    onMounted(async () => {
      const { auth } = route.query;
      if (!auth || typeof auth !== 'string') {
        await router.push({ name: 'survey-login', params: { surveyId: props.surveyId } });
        return;
      }
      token.value = auth;
    });

    return {
      captchaEl,
      errors,
      expired,
      fetchSurveyPublicInfo,
      status,
      submit,
      survey,
      verified,
    };
  },
});
</script>

<style lang="scss"></style>
