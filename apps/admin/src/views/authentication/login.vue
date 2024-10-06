<template>
  <app-entry-screen
    :subtitle="$t('common.login.subtitle')"
    :title="$t('common._')"
  >
    <v-form @keydown="errors.clear($event.target.name)" @submit.prevent="login">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                autocomplete="email"
                :error-messages="errors.get('email')"
                hide-details="auto"
                :label="$t('common.email')"
                name="email"
                prepend-inner-icon="fas fa-envelope"
                required
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                autocomplete="current-password"
                :error-messages="errors.get('password')"
                hide-details="auto"
                :label="$t('common.password._')"
                name="password"
                prepend-inner-icon="fas fa-key"
                required
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template #append-inner>
                  <v-icon class="me-2" @click="showPassword = !showPassword">
                    {{ showPassword ? 'fas fa-eye' : 'fas fa-eye-slash' }}
                  </v-icon>
                </template>
              </v-text-field>
              <v-btn
                class="mt-2 font-weight-bold"
                color="info"
                :to="{ name: 'password-request' }"
                variant="text"
              >
                {{ $t('common.password.forgot') }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <v-btn block color="primary" :disabled="isAppLoading" rounded size="x-large" type="submit">
                {{ $t('common.login._') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-form>
    <template v-if="signupEnabled">
      <v-divider class="mx-6" />
      <v-card-title class="text-h3 font-weight-medium text-center pt-6">
        {{ $t('common.signup.noAccount') }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12">
              <v-btn block color="primary" rounded size="x-large" :to="{ name: 'signup' }" variant="outlined">
                {{ $t('common.signup._') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </template>
    <mfa-dialog
      v-if="auth.mfa"
      :auth-data="auth.mfa"
      :model-value="!!auth.mfa"
      @close="clearMFAChallenge"
    />
  </app-entry-screen>
</template>

<script lang="ts">
import axios, { HttpStatusCode } from 'axios';
import { defineComponent } from 'vue';

import { useAuth, useMessages } from '@intake24/admin/stores';
import { Errors } from '@intake24/common/util';
import { AppEntryScreen } from '@intake24/ui';

import MfaDialog from './mfa-dialog.vue';

export default defineComponent({
  name: 'SignIn',

  components: { AppEntryScreen, MfaDialog },

  data() {
    const auth = useAuth();

    return {
      auth,
      email: '',
      password: '',
      showPassword: false,
      errors: new Errors(),
      signupEnabled: import.meta.env.VITE_ACL_SIGNUP_ENABLED === 'true',
    };
  },

  computed: {
    hasMFAChallenge(): boolean {
      return !!this.auth.mfa;
    },
  },

  async mounted() {
    // Check for Duo MFA response
    const { state: challengeId, code: token } = this.$route.query;
    if (typeof challengeId !== 'string' || typeof token !== 'string')
      return;

    try {
      await this.auth.verify({ challengeId, token, provider: 'duo' });
      await this.finalizeLogin();
    }
    catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === HttpStatusCode.Unauthorized) {
        useMessages().error('Invalid MFA authentication.');
        return;
      }

      throw err;
    }
  },

  methods: {
    clearMFAChallenge() {
      this.auth.mfa = null;
    },

    async finalizeLogin() {
      if (!this.auth.loggedIn)
        return;

      await this.$router.push({ name: 'dashboard' });
    },

    async login() {
      const { email, password } = this;
      try {
        await this.auth.login({ email, password });
        this.email = '';
        this.password = '';

        await this.finalizeLogin();
      }
      catch (err) {
        if (axios.isAxiosError(err)) {
          const { response: { status, data = {} } = {} } = err;

          if (status === HttpStatusCode.BadRequest && 'errors' in data) {
            this.errors.record(data.errors);
            return;
          }

          if (status === HttpStatusCode.Unauthorized) {
            useMessages().error('Invalid authentication credentials provided.');
            return;
          }
        }

        throw err;
      }
    },
  },
});
</script>

<style lang="scss"></style>
