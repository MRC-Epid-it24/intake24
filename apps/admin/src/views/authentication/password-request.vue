<template>
  <app-entry-screen
    :logo="logo"
    :subtitle="$t('common.password.request.subtitle').toString()"
    :title="$t('common.password.request._').toString()"
    width="30rem"
  >
    <v-card-text v-if="submitted" class="pa-6">
      <p class="text-h5 ma-4">{{ $t('common.password.request.sent') }}</p>
      <p class="text-subtitle-2 ma-4">{{ $t('common.spam') }}</p>
    </v-card-text>
    <v-form v-else @keydown.native="form.errors.clear($event.target.name)" @submit.prevent="submit">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                :error-messages="form.errors.get('email')"
                hide-details="auto"
                :label="$t('common.email')"
                name="email"
                outlined
                prepend-inner-icon="fas fa-envelope"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <v-btn block color="secondary" :disabled="isAppLoading" rounded type="submit" x-large>
                {{ $t('common.password.request.send') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <captcha ref="captcha" @expired="expired" @verified="verified"></captcha>
    </v-form>
    <v-card-actions>
      <v-btn color="info" exact text :to="{ name: 'login' }">
        <v-icon left>fas fa-angles-left</v-icon>
        {{ $t('common.login.back') }}
      </v-btn>
    </v-card-actions>
  </app-entry-screen>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

import { logo } from '@intake24/admin/assets';
import { form } from '@intake24/admin/helpers';
import { AppEntryScreen, Captcha } from '@intake24/ui';
import { useMessages } from '@intake24/ui/stores';

type PasswordRequestForm = {
  email: string | null;
  captcha: string | null;
};

export default defineComponent({
  name: 'PasswordRequest',

  components: { AppEntryScreen, Captcha },

  setup() {
    const captcha = ref<InstanceType<typeof Captcha>>();

    return reactive({
      form: form<PasswordRequestForm>({
        email: null,
        captcha: null,
      }),
      captcha,
      submitted: false,
      logo,
    });
  },

  methods: {
    resetCaptcha() {
      this.form.captcha = null;
      this.captcha?.reset();
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
          useMessages().error(this.$t('common.password.reset.captcha').toString());
        } else throw err;
      } finally {
        this.resetCaptcha();
      }
    },

    async submit() {
      if (this.captcha) {
        this.captcha.executeIfCan();
        return;
      }

      await this.sendRequest();
    },
  },
});
</script>

<style lang="scss"></style>
