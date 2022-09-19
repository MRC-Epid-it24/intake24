<template>
  <app-entry-screen
    :logo="logo"
    :subtitle="$t('common.login.subtitle').toString()"
    :title="$t('common._').toString()"
    width="30rem"
  >
    <v-form @keydown.native="errors.clear($event.target.name)" @submit.prevent="onLogin">
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
                outlined
                prepend-inner-icon="fas fa-envelope"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                autocomplete="current-password"
                :error-messages="errors.get('password')"
                hide-details="auto"
                :label="$t('common.password._')"
                name="password"
                outlined
                prepend-inner-icon="fas fa-key"
                required
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-btn
                class="mt-2 font-weight-bold"
                color="blue darken-3"
                text
                :to="{ name: 'password-request' }"
              >
                {{ $t('common.password.forgot') }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <v-btn block color="secondary" rounded type="submit" x-large>
                {{ $t('common.login._') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-form>
    <template v-if="signupEnabled">
      <v-divider class="mx-6"></v-divider>
      <v-card-title class="text-h3 font-weight-medium justify-center pt-6">
        {{ $t('common.signup.noAccount') }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12">
              <v-btn block color="secondary" outlined rounded :to="{ name: 'signup' }" x-large>
                {{ $t('common.signup._') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </template>
  </app-entry-screen>
</template>

<script lang="ts">
import type { AxiosError } from 'axios';
import axios from 'axios';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import { logo } from '@intake24/admin/assets';
import { useAuth, useMessages } from '@intake24/admin/stores';
import { Errors } from '@intake24/common/util';
import { AppEntryScreen } from '@intake24/ui';

export default defineComponent({
  name: 'SignIn',

  components: { AppEntryScreen },

  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      errors: new Errors(),
      signupEnabled: import.meta.env.VITE_ACL_SIGNUP_ENABLED === 'true',
      logo,
    };
  },

  computed: {
    ...mapState(useAuth, ['loggedIn', 'mfaRequestUrl']),
  },

  async mounted() {
    // Check for MFA response
    const { state, code } = this.$route.query;
    if (typeof state !== 'string' || typeof code !== 'string') return;

    try {
      await this.verify({ state, code });

      if (this.loggedIn) await this.$router.push({ name: 'dashboard' });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401)
        useMessages().error('Invalid MFA authentication.');
      else throw err;
    }
  },

  methods: {
    ...mapActions(useAuth, ['login', 'verify']),

    async onLogin() {
      const { email, password } = this;
      try {
        await this.login({ email, password });
        this.email = '';
        this.password = '';

        if (this.mfaRequestUrl) {
          window.location.href = this.mfaRequestUrl;
          return;
        }

        if (this.loggedIn) await this.$router.push({ name: 'dashboard' });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const { response: { status, data = {} } = {} } = err as AxiosError<any>;

          if (status === 422 && 'errors' in data) {
            this.errors.record(data.errors);
            return;
          }

          if (status === 401) {
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
