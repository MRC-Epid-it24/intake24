<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mt-10" outlined raised width="30rem">
          <v-card-title class="justify-center">
            <h2>{{ $t('users.password.reset._') }}</h2>
          </v-card-title>
          <v-card-text v-if="submitted">
            <p class="text-h6 ma-4">Password reset link has been sent to your email address.</p>
            <p class="text-subtitle-2 ma-4">Please check your inbox (including Junk folder).</p>
          </v-card-text>
          <v-form
            v-else
            @keydown.native="form.errors.clear($event.target.name)"
            @submit.prevent="onSubmit"
          >
            <v-card-text>
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
                <v-col cols="12">
                  <vue-recaptcha
                    ref="recaptcha"
                    size="invisible"
                    :sitekey="recaptcha.sitekey"
                    @verify="onCaptchaVerified"
                    @expired="onCaptchaExpired"
                  >
                  </vue-recaptcha>
                </v-col>
              </v-row>
              <v-card-actions class="px-0">
                <v-btn type="submit" color="secondary" xLarge width="100%">
                  {{ $t('users.password.reset.send') }}
                </v-btn>
              </v-card-actions>
              <v-divider class="mt-6"></v-divider>
              <v-card-text class="pa-2 text-caption">
                This site is protected by reCAPTCHA and the Google
                <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and
                <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a>
                apply.
              </v-card-text>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import VueRecaptcha from 'vue-recaptcha';
import Form from '@/helpers/Form';

export interface RecaptchaRef {
  $refs: {
    recaptcha: any;
  };
}

export default (Vue as VueConstructor<Vue & RecaptchaRef>).extend({
  name: 'PasswordRequest',

  components: { VueRecaptcha },

  data() {
    return {
      form: new Form({
        email: null,
        recaptcha: null,
      }),
      recaptcha: {
        enabled: process.env.VUE_APP_RECAPTCHA_ENABLED === 'true',
        sitekey: process.env.VUE_APP_RECAPTCHA_SITEKEY,
      },
      submitted: false,
    };
  },

  methods: {
    async onSubmit() {
      if (this.recaptcha.enabled === true && !this.form.recaptcha) {
        this.$refs.recaptcha.execute();
        return;
      }

      this.sendRequest();
    },

    onCaptchaVerified(token: string) {
      this.form.recaptcha = token;
      this.sendRequest();
    },

    onCaptchaExpired() {
      this.$refs.recaptcha.reset();
    },

    async sendRequest() {
      try {
        await this.form.post('v3/password', { withErr: true });
        this.submitted = true;
      } catch (err) {
        if (this.form.errors.has('recaptcha')) {
          this.form.errors.clear('recaptcha');
          this.$toasted.error(this.$t('users.password.reset.recaptcha') as string);
        }
      } finally {
        if (this.$refs.recaptcha) this.$refs.recaptcha.reset();
        this.form.recaptcha = null;
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
