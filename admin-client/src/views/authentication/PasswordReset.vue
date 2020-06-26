<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mt-10" outlined raised width="30rem">
          <v-card-title class="justify-center">
            <h2>{{ $t('users.password.reset._') }}</h2>
          </v-card-title>
          <v-form
            @keydown.native="form.errors.clear($event.target.name)"
            @submit.prevent="onSubmit"
          >
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    :error-messages="form.errors.get('email')"
                    :label="$t('users.email')"
                    hide-details="auto"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    :error-messages="form.errors.get('password')"
                    :label="$t('users.password._')"
                    hide-details="auto"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="passwordConfirmation"
                    :error-messages="form.errors.get('passwordConfirmation')"
                    :label="$t('users.password.confirmation')"
                    hide-details="auto"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-card-actions class="px-0">
                <v-btn type="submit" color="secondary" xLarge width="100%">
                  {{ $t('users.password.reset._') }}
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
import Vue from 'vue';
import Form from '@/helpers/Form';

export default Vue.extend({
  name: 'PasswordReset',

  data() {
    return {
      form: new Form({
        token: this.$route.params.token,
        email: null,
        password: null,
        passwordConfirmation: null,
      }),
    };
  },

  methods: {
    async onSubmit() {
      await this.form.post('v3/password/reset');
    },
  },
});
</script>

<style lang="scss"></style>
