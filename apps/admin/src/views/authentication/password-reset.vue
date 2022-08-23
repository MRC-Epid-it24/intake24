<template>
  <v-row justify="center" no-gutters>
    <v-col cols="auto">
      <v-card class="mt-10" outlined raised width="30rem">
        <v-card-title class="justify-center pt-6">
          <h2>{{ $t('users.password.reset._') }}</h2>
        </v-card-title>
        <v-form @keydown.native="form.errors.clear($event.target.name)" @submit.prevent="submit">
          <v-card-text class="px-6">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  autocomplete="current-password"
                  :error-messages="form.errors.get('email')"
                  hide-details="auto"
                  :label="$t('users.email')"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.password"
                  autocomplete="new-password"
                  :error-messages="form.errors.get('password')"
                  hide-details="auto"
                  :label="$t('users.password._')"
                  outlined
                  required
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.passwordConfirm"
                  autocomplete="new-password"
                  :error-messages="form.errors.get('passwordConfirm')"
                  hide-details="auto"
                  :label="$t('users.password.confirm')"
                  outlined
                  required
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col v-if="nonInputErrors.length">
                <v-alert
                  v-for="error in nonInputErrors"
                  :key="error.param"
                  border="left"
                  :icon="false"
                  text
                  type="error"
                >
                  {{ error.msg }}
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-6 pb-6">
            <v-btn color="secondary" type="submit" width="100%" x-large>
              {{ $t('users.password.reset._') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ValidationError } from '@intake24/common/types';
import { form } from '@intake24/admin/helpers';
import { useMessages } from '@intake24/ui/stores';

type PasswordResetForm = {
  token: string;
  email: string | null;
  password: string | null;
  passwordConfirm: string | null;
};

export default defineComponent({
  name: 'PasswordReset',

  data() {
    return {
      form: form<PasswordResetForm>({
        token: this.$route.params.token,
        email: null,
        password: null,
        passwordConfirm: null,
      }),
    };
  },

  computed: {
    nonInputErrors(): ValidationError[] {
      const keys = this.form.keys as string[];

      const allErrors = this.form.errors.all();

      const errors = Object.keys(allErrors).reduce<ValidationError[]>((acc, error) => {
        if (!keys.includes(error) || error === 'token') acc.push({ ...allErrors[error] });

        return acc;
      }, []);

      return errors;
    },
  },

  methods: {
    async submit() {
      await this.form.post('password/reset');
      useMessages().success(this.$t('users.password.changed').toString());
      this.$router.push({ name: 'login' });
    },
  },
});
</script>

<style lang="scss"></style>
