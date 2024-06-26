<template>
  <div v-if="provider">
    <v-divider class="mx-6 mt-3" />
    <v-card-text class="px-6 pt-2 pb-6 text-caption">
      <component
        :is="provider"
        ref="captcha"
        :sitekey="sitekey"
        size="invisible"
        @challengeExpired="expired"
        @expired="expired"
        @verify="verified"
      />
      <template v-if="provider === 'h-captcha'">
        This site is protected by <a href="https://hCaptcha.com" target="_blank">hCaptcha</a>
        and its
        <a href="https://hcaptcha.com/privacy" target="_blank">Privacy Policy</a> and
        <a href="https://hcaptcha.com/terms" target="_blank">Terms of Service</a>
        apply.
      </template>
      <template v-else>
        This site is protected by
        <a href="https://www.google.com/recaptcha" target="_blank">reCAPTCHA</a>
        and Google
        <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and
        <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a>
        apply.
      </template>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import HCaptcha from '@hcaptcha/vue-hcaptcha';
import { defineComponent, ref } from 'vue';
import ReCaptcha from 'vue-recaptcha';

import type { CaptchaProvider } from '@intake24/common/security';

export default defineComponent({
  name: 'Captcha',

  components: { HCaptcha, ReCaptcha },

  emits: ['expired', 'verified'],

  setup(props, { emit }) {
    const captcha = ref<InstanceType<typeof HCaptcha | typeof ReCaptcha>>();
    const provider = ref<CaptchaProvider | null>(import.meta.env.VITE_CAPTCHA_PROVIDER || null);
    const sitekey = ref<string>(import.meta.env.VITE_CAPTCHA_SITEKEY || '');

    const execute = () => {
      captcha.value?.execute();
    };

    const reset = () => {
      captcha.value?.reset();
    };

    const expired = () => {
      emit('expired');
      reset();
    };

    const verified = (token?: string /* , eKey: string */) => {
      emit('verified', token);
    };

    const executeIfCan = () => {
      if (!provider.value) {
        verified();
        return;
      }

      execute();
    };

    return { captcha, provider, sitekey, execute, executeIfCan, expired, reset, verified };
  },
});
</script>

<style lang="scss"></style>
