<template>
  <app-entry-screen
    :subtitle="$t('common.password.reset.subtitle')"
    :title="$t('common.password.reset._')"
  >
    <v-form @keydown="form.errors.clear($event.target.name)" @submit.prevent="submit">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                autocomplete="email"
                :error-messages="form.errors.get('email')"
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
                v-model="form.password"
                autocomplete="new-password"
                :error-messages="form.errors.get('password')"
                hide-details="auto"
                :label="$t('common.password._')"
                name="password"
                prepend-inner-icon="fas fa-key"
                required
                type="password"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.passwordConfirm"
                autocomplete="new-password"
                :error-messages="form.errors.get('passwordConfirm')"
                hide-details="auto"
                :label="$t('common.password.confirm')"
                name="passwordConfirm"
                prepend-inner-icon="fas fa-key"
                required
                type="password"
                variant="outlined"
              />
            </v-col>
            <error-list :errors="nonInputErrors" tag="v-col" />
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <v-btn block color="primary" :disabled="isAppLoading" rounded size="x-large" type="submit">
                {{ $t('common.password.reset._') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-form>
    <v-card-actions>
      <v-btn color="info" exact :to="{ name: 'login' }" variant="text">
        <v-icon icon="fas fa-angles-left" start />
        {{ $t('common.login.back') }}
      </v-btn>
    </v-card-actions>
  </app-entry-screen>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ValidationError } from '@intake24/common/util';
import { ErrorList } from '@intake24/admin/components/forms';
import { createForm } from '@intake24/admin/util';
import { AppEntryScreen } from '@intake24/ui';
import { useMessages } from '@intake24/ui/stores';

type PasswordResetForm = {
  token: string;
  email: string | null;
  password: string | null;
  passwordConfirm: string | null;
};

export default defineComponent({
  name: 'PasswordReset',

  components: { AppEntryScreen, ErrorList },

  data() {
    return {
      form: createForm<PasswordResetForm>({
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
        if (!keys.includes(error) || error === 'token')
          acc.push({ ...allErrors[error] });

        return acc;
      }, []);

      return errors;
    },
  },

  methods: {
    async submit() {
      await this.form.post('password/reset');
      useMessages().success(this.$t('common.password.changed'));
      await this.$router.push({ name: 'login' });
    },
  },
});
</script>

<style lang="scss"></style>
