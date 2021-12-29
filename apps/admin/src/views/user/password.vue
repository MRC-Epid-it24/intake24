<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" :title="$t('user.password.change')" outlined>
        {{ $t('user.password.change') }}
      </v-btn>
    </template>
    <v-card :loading="loading">
      <v-toolbar color="primary" dark flat>
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('user.password.change') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-form @keydown.native="form.errors.clear($event.target.name)" @submit.prevent="submit">
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.passwordCurrent"
                :append-icon="showPassword.current ? 'fa-eye' : 'fa-eye-slash'"
                :error-messages="form.errors.get('passwordCurrent')"
                :label="$t('users.password.current')"
                :type="showPassword.current ? 'text' : 'password'"
                hide-details="auto"
                name="passwordCurrent"
                required
                outlined
                @click:append="showPassword.current = !showPassword.current"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                :append-icon="showPassword.password ? 'fa-eye' : 'fa-eye-slash'"
                :error-messages="form.errors.get('password')"
                :label="$t('users.password.new')"
                :type="showPassword.password ? 'text' : 'password'"
                hide-details="auto"
                name="password"
                required
                outlined
                @click:append="showPassword.password = !showPassword.password"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.passwordConfirm"
                :append-icon="showPassword.confirm ? 'fa-eye' : 'fa-eye-slash'"
                :error-messages="form.errors.get('passwordConfirm')"
                :label="$t('users.password.confirm')"
                :type="showPassword.confirm ? 'text' : 'password'"
                hide-details="auto"
                name="passwordConfirm"
                required
                outlined
                @click:append="showPassword.confirm = !showPassword.confirm"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn type="submit" color="secondary" xLarge width="100%">
            {{ $t('user.password.update') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { form } from '@/helpers';

export default Vue.extend({
  name: 'UserPassword',

  data() {
    return {
      dialog: false,
      loading: false,
      form: form({
        passwordCurrent: null,
        password: null,
        passwordConfirm: null,
      }),
      showPassword: {
        current: false,
        password: false,
        confirm: false,
      },
    };
  },

  methods: {
    close() {
      this.dialog = false;
      this.form.reset();
    },

    cancel() {
      this.close();
    },

    async submit() {
      this.loading = true;

      try {
        await this.form.post('/user/password');
        this.close();
        this.$toasted.success(this.$t('user.password.updated').toString());
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
