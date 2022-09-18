<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" outlined :title="$t('users.password.change')" v-on="on">
        {{ $t('users.password.change') }}
      </v-btn>
    </template>
    <v-card :loading="loading">
      <v-toolbar color="primary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('users.password.change') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-form @keydown.native="form.errors.clear($event.target.name)" @submit.prevent="submit">
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.passwordCurrent"
                :append-icon="showPassword.current ? 'fa-eye' : 'fa-eye-slash'"
                autocomplete="current-password"
                :error-messages="form.errors.get('passwordCurrent')"
                hide-details="auto"
                :label="$t('users.password.current')"
                name="passwordCurrent"
                outlined
                required
                :type="showPassword.current ? 'text' : 'password'"
                @click:append="showPassword.current = !showPassword.current"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                :append-icon="showPassword.password ? 'fa-eye' : 'fa-eye-slash'"
                autocomplete="new-password"
                :error-messages="form.errors.get('password')"
                hide-details="auto"
                :label="$t('users.password.new')"
                name="password"
                outlined
                required
                :type="showPassword.password ? 'text' : 'password'"
                @click:append="showPassword.password = !showPassword.password"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.passwordConfirm"
                :append-icon="showPassword.confirm ? 'fa-eye' : 'fa-eye-slash'"
                autocomplete="new-password"
                :error-messages="form.errors.get('passwordConfirm')"
                hide-details="auto"
                :label="$t('users.password.confirm')"
                name="passwordConfirm"
                outlined
                required
                :type="showPassword.confirm ? 'text' : 'password'"
                @click:append="showPassword.confirm = !showPassword.confirm"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn color="secondary" type="submit" width="100%" x-large>
            {{ $t('users.password.update') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { form } from '@intake24/admin/helpers';
import { useMessages } from '@intake24/ui/stores';

export default defineComponent({
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
        await this.form.post('user/password');
        this.close();
        useMessages().success(this.$t('users.password.updated').toString());
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
