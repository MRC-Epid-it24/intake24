<template>
  <v-row justify="center" no-gutters>
    <v-col cols="auto">
      <v-card class="mt-10" outlined raised width="30rem">
        <v-card-title class="justify-center pt-6">
          <h2>{{ $t('users.password.reset._') }}</h2>
        </v-card-title>
        <v-card-text v-if="submitted">
          <p class="text-h5 ma-4">{{ $t('users.password.reset.sent') }}</p>
          <p class="text-subtitle-2 ma-4">
            Please check your inbox (including spam / junk folder).
          </p>
          <v-card-actions class="d-flex justify-center">
            <v-btn :to="{ name: 'login' }" color="blue darken-3" exact text>
              Back to login screen
            </v-btn>
          </v-card-actions>
        </v-card-text>
        <v-form
          v-else
          @keydown.native="form.errors.clear($event.target.name)"
          @submit.prevent="submit"
        >
          <v-card-text class="px-6">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  :error-messages="form.errors.get('email')"
                  :label="$t('users.email')"
                  hide-details="auto"
                  required
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-6 pb-6">
            <v-btn type="submit" block color="secondary" x-large>
              {{ $t('users.password.reset.send') }}
            </v-btn>
          </v-card-actions>
          <div v-if="captcha.enabled">
            <v-divider class="mx-6 mt-3"></v-divider>
            <component
              :is="captcha.provider"
              ref="captchaRef"
              :sitekey="captcha.sitekey"
              @verified="verified"
              @expired="expired"
            ></component>
          </div>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

import { form } from '@intake24/admin/helpers';
import { HCaptcha, ReCaptcha } from '@intake24/ui';
import { useMessages } from '@intake24/ui/stores';

type PasswordRequestForm = {
  email: string | null;
  captcha: string | null;
};

export default defineComponent({
  name: 'PasswordRequest',

  components: { HCaptcha, ReCaptcha },

  setup() {
    const captchaRef = ref<InstanceType<typeof HCaptcha | typeof ReCaptcha>>();

    return reactive({
      form: form<PasswordRequestForm>({
        email: null,
        captcha: null,
      }),
      captcha: {
        enabled: !!import.meta.env.VITE_APP_CAPTCHA_PROVIDER,
        provider: import.meta.env.VITE_APP_CAPTCHA_PROVIDER,
        sitekey: import.meta.env.VITE_APP_CAPTCHA_SITEKEY as string,
      },
      captchaRef,
      submitted: false,
    });
  },

  methods: {
    resetCaptcha() {
      this.form.captcha = null;
      this.captchaRef?.reset();
    },

    async verified(token: string) {
      this.form.captcha = token;
      await this.sendRequest();
    },

    expired() {
      this.resetCaptcha();
    },

    async sendRequest() {
      try {
        await this.form.post('password');
        this.submitted = true;
      } catch (err) {
        if (this.form.errors.has('captcha')) {
          this.form.errors.clear('captcha');
          useMessages().error(this.$t('users.password.reset.captcha').toString());
        } else throw err;
      } finally {
        this.resetCaptcha();
      }
    },

    async submit() {
      if (this.captcha.enabled === true && !this.form.captcha) {
        this.captchaRef?.execute();
        return;
      }

      await this.sendRequest();
    },
  },
});
</script>

<style lang="scss"></style>
