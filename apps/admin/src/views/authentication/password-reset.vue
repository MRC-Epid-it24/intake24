<template>
  <app-entry-screen
    :logo="logo"
    :subtitle="$t('common.password.reset.subtitle').toString()"
    :title="$t('common.password.reset._').toString()"
    width="30rem"
  >
    <v-form @keydown.native="form.errors.clear($event.target.name)" @submit.prevent="submit">
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
                outlined
                prepend-inner-icon="fas fa-envelope"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                autocomplete="new-password"
                :error-messages="form.errors.get('password')"
                hide-details="auto"
                :label="$t('common.password._')"
                name="password"
                outlined
                prepend-inner-icon="fas fa-key"
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
                :label="$t('common.password.confirm')"
                name="passwordConfirm"
                outlined
                prepend-inner-icon="fas fa-key"
                required
                type="password"
              ></v-text-field>
            </v-col>
            <error-list :errors="nonInputErrors" tag="v-col"></error-list>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <v-btn block color="secondary" rounded type="submit" x-large>
                {{ $t('common.password.reset._') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-form>
    <v-card-actions>
      <v-btn color="blue darken-3" exact text :to="{ name: 'login' }">
        <v-icon left>fas fa-angles-left</v-icon>
        {{ $t('common.login.back') }}
      </v-btn>
    </v-card-actions>
  </app-entry-screen>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ValidationError } from '@intake24/common/types';
import { logo } from '@intake24/admin/assets';
import { ErrorList } from '@intake24/admin/components/forms';
import { form } from '@intake24/admin/helpers';
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
      form: form<PasswordResetForm>({
        token: this.$route.params.token,
        email: null,
        password: null,
        passwordConfirm: null,
      }),
      logo,
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
      useMessages().success(this.$t('common.password.changed').toString());
      await this.$router.push({ name: 'login' });
    },
  },
});
</script>

<style lang="scss"></style>
