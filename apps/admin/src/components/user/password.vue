<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="500px">
    <template #activator="{ attrs, on }">
      <v-btn v-bind="attrs" outlined :title="$t('common.password.change')" v-on="on">
        {{ $t('common.password.change') }}
      </v-btn>
    </template>
    <v-card :loading="loading" :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('common.password.change') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-form @keydown.native="form.errors.clear($event.target.name)" @submit.prevent="submit">
        <input
          autocomplete="username email"
          class="d-none"
          name="email"
          type="text"
          :value="email"
        >
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.passwordCurrent"
                :append-icon="showPassword.current ? 'fas fa-eye' : 'fas fa-eye-slash'"
                autocomplete="current-password"
                :error-messages="form.errors.get('passwordCurrent')"
                hide-details="auto"
                :label="$t('common.password.current')"
                name="passwordCurrent"
                outlined
                prepend-inner-icon="fas fa-key"
                required
                :type="showPassword.current ? 'text' : 'password'"
                @click:append="showPassword.current = !showPassword.current"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                :append-icon="showPassword.password ? 'fas fa-eye' : 'fas fa-eye-slash'"
                autocomplete="new-password"
                :error-messages="form.errors.get('password')"
                hide-details="auto"
                :label="$t('common.password.new')"
                name="password"
                outlined
                prepend-inner-icon="fas fa-key"
                required
                :type="showPassword.password ? 'text' : 'password'"
                @click:append="showPassword.password = !showPassword.password"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.passwordConfirm"
                :append-icon="showPassword.confirm ? 'fas fa-eye' : 'fas fa-eye-slash'"
                autocomplete="new-password"
                :error-messages="form.errors.get('passwordConfirm')"
                hide-details="auto"
                :label="$t('common.password.confirm')"
                name="passwordConfirm"
                outlined
                prepend-inner-icon="fas fa-key"
                required
                :type="showPassword.confirm ? 'text' : 'password'"
                @click:append="showPassword.confirm = !showPassword.confirm"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn color="primary" type="submit" width="100%" x-large>
            {{ $t('common.password.update') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { createForm } from '@intake24/admin/util';
import { useMessages } from '@intake24/ui/stores';

export default defineComponent({
  name: 'UserPassword',

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
      loading: false,
      form: createForm({
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
        useMessages().success(this.$t('common.password.updated').toString());
      }
      finally {
        this.loading = false;
      }
    },
  },
});
</script>
