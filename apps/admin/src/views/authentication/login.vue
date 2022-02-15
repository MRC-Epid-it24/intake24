<template>
  <v-row justify="center" no-gutters>
    <v-col cols="auto">
      <v-card class="mt-10" outlined raised max-width="30rem">
        <v-card-title class="justify-center pt-6">
          <h2>{{ $t('common._') }}</h2>
        </v-card-title>
        <v-form @keydown.native="errors.clear($event.target.name)" @submit.prevent="onLogin">
          <v-card-text class="px-6">
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
                  :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                  :error-messages="errors.get('password')"
                  :label="$t('users.password._')"
                  :type="showPassword ? 'text' : 'password'"
                  hide-details="auto"
                  required
                  outlined
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-6 pb-6">
            <v-btn type="submit" color="secondary" xLarge width="100%">
              {{ $t('common.login') }}
            </v-btn>
          </v-card-actions>
          <v-divider class="mx-6"></v-divider>
          <v-card-actions class="d-flex justify-end px-6 pb-6">
            <v-btn :to="{ name: 'password-request' }" color="blue darken-3" text>
              {{ $t('users.password.forgot') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import axios, { AxiosError } from 'axios';
import { mapActions, mapState } from 'pinia';
import { Errors } from '@intake24/common/util';
import { useAuth } from '@intake24/admin/stores';

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
        this.$toasted.error('Invalid MFA authentication.');
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

          if (status === 422 && 'errors' in data) this.errors.record(data.errors);

          if (status === 401) this.$toasted.error('Invalid authentication credentials provided.');
        }
      }
    },
  },
});
</script>

<style lang="scss"></style>
