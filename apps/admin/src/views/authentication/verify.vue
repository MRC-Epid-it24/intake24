<template>
  <app-entry-screen
    :subtitle="$t('common.verify.subtitle')"
    :title="$t('common.verify._')"
  >
    <v-card-text class="px-6">
      <p class="text-subtitle-2">
        {{ $t('common.spam') }}
      </p>
      <error-list :errors="errors.getErrors()" />
    </v-card-text>
    <v-card-text class="pt-0">
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            <v-btn
              block
              color="primary"
              :disabled="isAppLoading"
              rounded
              size="x-large"
              variant="outlined"
              @click="resend"
            >
              {{ $t('common.verify.resend') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </app-entry-screen>
</template>

<script lang="ts">
import axios, { HttpStatusCode } from 'axios';
import { defineComponent, reactive } from 'vue';

import { ErrorList } from '@intake24/admin/components/forms';
import { useAuth, useMessages, useUser } from '@intake24/admin/stores';
import { Errors } from '@intake24/common/util';
import { AppEntryScreen } from '@intake24/ui';

export default defineComponent({
  name: 'VerifyEmail',

  components: { AppEntryScreen, ErrorList },

  async beforeRouteEnter(to, from, next) {
    await useAuth().refresh(false);
    if (useUser().isVerified)
      next({ name: 'dashboard' });
    else
      next();
  },

  setup() {
    return reactive({
      user: useUser(),
      errors: new Errors(),
    });
  },

  async mounted() {
    const { token } = this.$route.query;
    if (typeof token !== 'string')
      return;

    await this.verify(token);
  },

  methods: {
    async resend() {
      await this.$http.post('admin/user/verify', {}, { withLoading: true });
      useMessages().success(this.$t('common.verify.resent'));
    },

    async verify(token: string) {
      try {
        await this.$http.post('admin/sign-up/verify', { token }, { withLoading: true });

        if (useAuth().loggedIn) {
          await this.user.request();
          await this.$router.push({ name: 'dashboard' });
        }
        else {
          await this.$router.push({ name: 'login' });
        }
      }
      catch (err) {
        if (axios.isAxiosError(err)) {
          const { response: { status, data = {} } = {} } = err;

          if (status === HttpStatusCode.BadRequest && 'errors' in data) {
            this.errors.record(data.errors);
            return;
          }
        }

        throw err;
      }
    },
  },
});
</script>

<style lang="scss"></style>
