<template>
  <v-row justify="center" no-gutters>
    <v-col cols="auto">
      <v-card class="mt-10" max-width="30rem" outlined raised>
        <v-card-title class="justify-center pt-6">
          <h2>{{ $t('common._') }}</h2>
        </v-card-title>
        <v-form @keydown.native="errors.clear($event.target.name)" @submit.prevent="onLogin">
          <v-card-text class="px-6">
            <v-row>
              <v-col class="mb-3" cols="12">
                <v-text-field
                  v-model="email"
                  autocomplete="email"
                  :error-messages="errors.get('email')"
                  hide-details="auto"
                  :label="$t('users.email')"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col class="mb-3" cols="12">
                <v-text-field
                  v-model="password"
                  :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                  autocomplete="current-password"
                  :error-messages="errors.get('password')"
                  hide-details="auto"
                  :label="$t('users.password._')"
                  outlined
                  required
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-6 pb-6">
            <v-btn color="secondary" type="submit" width="100%" x-large>
              {{ $t('common.login') }}
            </v-btn>
          </v-card-actions>
          <v-divider class="mx-6"></v-divider>
          <v-card-actions class="d-flex justify-end px-6 pb-6">
            <v-btn color="blue darken-3" text :to="{ name: 'password-request' }">
              {{ $t('users.password.forgot') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { AxiosError } from 'axios';
import axios from 'axios';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import { useAuth, useMessages } from '@intake24/admin/stores';
import { Errors } from '@intake24/common/util';

export default defineComponent({
  name: 'AppLogin',

  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      errors: new Errors(),
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
