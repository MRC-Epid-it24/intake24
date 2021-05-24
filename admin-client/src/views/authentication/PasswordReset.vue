<template>
  <v-row justify="center">
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
                  :error-messages="form.errors.get('email')"
                  :label="$t('users.email')"
                  hide-details="auto"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.password"
                  :error-messages="form.errors.get('password')"
                  :label="$t('users.password._')"
                  hide-details="auto"
                  required
                  outlined
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.passwordConfirm"
                  :error-messages="form.errors.get('passwordConfirm')"
                  :label="$t('users.password.confirm')"
                  hide-details="auto"
                  required
                  outlined
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col v-if="nonInputErrors.length">
                <v-alert
                  v-for="error in nonInputErrors"
                  :key="error.param"
                  :icon="false"
                  border="left"
                  text
                  type="error"
                >
                  {{ error.msg }}
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-6 pb-6">
            <v-btn type="submit" color="secondary" xLarge width="100%">
              {{ $t('users.password.reset._') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import form from '@/helpers/Form';
import { ValidationError } from '@common/types';

type PasswordResetForm = {
  token: string;
  email: string | null;
  password: string | null;
  passwordConfirm: string | null;
};

export default Vue.extend({
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
      this.$toasted.success(this.$t('users.password.changed') as string);
      this.$router.push({ name: 'login' });
    },
  },
});
</script>

<style lang="scss"></style>
