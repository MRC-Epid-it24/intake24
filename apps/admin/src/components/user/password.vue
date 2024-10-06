<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.display.smAndDown" max-width="500px">
    <template #activator="{ props }">
      <v-btn :title="$t('common.password.change')" variant="outlined" v-bind="props">
        {{ $t('common.password.change') }}
      </v-btn>
    </template>
    <v-card :loading="loading" :tile="$vuetify.display.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="cancel" />
        <v-toolbar-title>
          {{ $t('common.password.change') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-form @keydown="form.errors.clear($event.target.name)" @submit.prevent="submit">
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
                autocomplete="current-password"
                :error-messages="form.errors.get('passwordCurrent')"
                hide-details="auto"
                :label="$t('common.password.current')"
                name="passwordCurrent"
                prepend-inner-icon="fas fa-key"
                required
                :type="showPassword.current ? 'text' : 'password'"
                variant="outlined"
              >
                <template #append-inner>
                  <v-icon class="me-2" @click="showPassword.current = !showPassword.current">
                    {{ showPassword.current ? 'fas fa-eye' : 'fas fa-eye-slash' }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                autocomplete="new-password"
                :error-messages="form.errors.get('password')"
                hide-details="auto"
                :label="$t('common.password.new')"
                name="password"
                prepend-inner-icon="fas fa-key"
                required
                :type="showPassword.password ? 'text' : 'password'"
                variant="outlined"
              >
                <template #append-inner>
                  <v-icon class="me-2" @click="showPassword.password = !showPassword.password">
                    {{ showPassword.password ? 'fas fa-eye' : 'fas fa-eye-slash' }}
                  </v-icon>
                </template>
              </v-text-field>
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
                :type="showPassword.confirm ? 'text' : 'password'"
                variant="outlined"
              >
                <template #append-inner>
                  <v-icon class="me-2" @click="showPassword.confirm = !showPassword.confirm">
                    {{ showPassword.confirm ? 'fas fa-eye' : 'fas fa-eye-slash' }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn color="primary" size="x-large" type="submit" variant="flat" width="100%">
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
        useMessages().success(this.$t('common.password.updated'));
      }
      finally {
        this.loading = false;
      }
    },
  },
});
</script>
