<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card v-if="mfaChallenge" class="mt-10" outlined raised width="30rem" height="25rem">
          <iframe id="duo_iframe"></iframe>
        </v-card>
        <v-card v-else class="mt-10" outlined raised max-width="30rem">
          <v-card-title class="justify-center">
            <h2>{{ $t('common._') }}</h2>
          </v-card-title>
          <v-form @keydown.native="errors.clear($event.target.name)" @submit.prevent="onLogin">
            <v-card-text>
              <v-row>
                <v-col cols="12" class="mb-3">
                  <v-text-field
                    v-model="email"
                    :error-messages="errors.get('email')"
                    :label="$t('users.email')"
                    hide-details="auto"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-3">
                  <v-text-field
                    v-model="password"
                    :error-messages="errors.get('password')"
                    :label="$t('users.password._')"
                    hide-details="auto"
                    type="password"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-card-actions class="px-0">
                <v-btn type="submit" color="secondary" xLarge width="100%">
                  {{ $t('common.login') }}
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import Errors from '@/helpers/Errors';

export default Vue.extend({
  name: 'Login',

  data() {
    return {
      email: '',
      password: '',
      errors: new Errors(),
    };
  },

  computed: mapGetters({ mfaChallenge: 'auth/mfaChallenge', loggedIn: 'user/loggedIn' }),

  methods: {
    ...mapActions('auth', ['login', 'verify']),

    async onLogin() {
      const { email, password } = this;
      try {
        await this.login({ email, password });
        this.email = '';
        this.password = '';

        if (this.mfaChallenge) {
          window.Duo.init({
            iframe: 'duo_iframe',
            host: this.mfaChallenge.host,
            sig_request: this.mfaChallenge.request,
            submit_callback: this.mfaVerify.bind(this),
          });

          return;
        }

        if (this.loggedIn) await this.$router.push({ name: 'dashboard' });
      } catch (err) {
        const { response: { status, data = {} } = {} } = err as AxiosError;

        if (status === 422 && 'errors' in data) this.errors.record(data.errors);

        if (status === 401) this.$toasted.error('Invalid authentication credentials provided.');
      }
    },

    async mfaVerify(form: HTMLElement) {
      try {
        const sigResponse = form.querySelector<HTMLInputElement>('input[name=sig_response]')?.value;
        await this.verify(sigResponse);

        if (this.loggedIn) await this.$router.push({ name: 'dashboard' });
      } catch (err) {
        if (err.response?.status === 401) this.$toasted.error('Invalid MFA authentication.');
      }
    },
  },
});
</script>

<style lang="scss">
#duo_iframe {
  height: 100%;
  width: 100%;
  border: none;
}
</style>
