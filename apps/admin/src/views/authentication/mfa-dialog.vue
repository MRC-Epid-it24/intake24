<template>
  <v-dialog v-bind="{ modelValue }" :fullscreen="$vuetify.display.smAndDown" max-width="600px">
    <v-card :tile="$vuetify.display.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="close" />
        <v-toolbar-title>{{ $t('common.mfa.title') }}</v-toolbar-title>
      </v-toolbar>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-sheet color="grey-lighten-3">
            <v-card-text class="d-flex justify-center align-center">
              <v-card v-if="provider === 'duo'" flat tile>
                <v-sheet class="d-flex flex-column align-center py-6" color="grey-lighten-3">
                  <v-progress-circular
                    class="mb-4"
                    color="primary"
                    :model-value="duo.value"
                    :rotate="-90"
                    :size="200"
                    :width="20"
                  >
                    <div class="d-flex align-center flex-column">
                      <v-icon class="provider-icon mb-2 ml-2" color="secondary">
                        $duo
                      </v-icon>
                      <span class="font-weight-bold text-h4">{{ duo.value / 20 }} </span>
                    </div>
                  </v-progress-circular>
                  <v-btn block color="secondary" rounded @click="duoChallenge">
                    {{ $t('common.action.redirect') }}
                  </v-btn>
                </v-sheet>
              </v-card>
              <v-card v-if="provider === 'fido'" flat link tile @click="fidoChallenge">
                <v-sheet class="d-flex flex-column align-center py-6" color="grey-lighten-3">
                  <v-icon class="provider-icon mb-6" color="secondary">
                    $fido
                  </v-icon>
                  <v-btn block color="secondary" rounded @click="fidoChallenge">
                    {{ $t('common.action.retry') }}
                  </v-btn>
                </v-sheet>
              </v-card>
              <v-form v-if="provider === 'otp'" autocomplete="off" @submit.prevent="otpChallenge">
                <div class="d-flex flex-column align-center" :style="{ maxWidth: '300px' }">
                  <v-icon class="provider-icon mb-4" color="secondary">
                    $otp
                  </v-icon>
                  <p class="mb-2 text-subtitle-1">
                    {{ $t('common.mfa.otp') }}
                  </p>
                  <v-otp-input
                    v-model="otp.token"
                    autocomplete="off"
                    class="mb-4"
                    :error-messages="otp.errors.get('token')"
                    hide-details="auto"
                    length="6"
                    name="token"
                    @update:model-value="otp.errors.clear('token')"
                  />
                  <v-btn block color="secondary" rounded type="submit">
                    {{ $t('common.action.confirm._') }}
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
          <v-list
            v-model="deviceId"
            class="list-border"
            lines="two"
            @change="selectDevice"
          >
            <v-list-subheader>{{ $t('common.mfa.devices') }}</v-list-subheader>
            <v-list-item v-for="device in authData.devices" :key="device.id" link :value="device.id">
              <template #prepend>
                <v-icon :title="$t(`user.mfa.providers.${device.provider}._`)">
                  {{ `$${device.provider}` }}
                </v-icon>
              </template>
              <v-list-item-title>{{ device.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ device.provider }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { startAuthentication } from '@simplewebauthn/browser';
import { HttpStatusCode, isAxiosError } from 'axios';
import { defineComponent } from 'vue';

import type { LoginResponse, MFAAuthResponse } from '@intake24/common/types/http';
import { useAuth, useMessages } from '@intake24/admin/stores';
import { createForm } from '@intake24/admin/util';

export default defineComponent({
  name: 'MFADialog',

  props: {
    authData: {
      type: Object as PropType<MFAAuthResponse>,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['close', 'confirm'],

  data() {
    return {
      auth: useAuth(),
      otp: createForm({ challengeId: '', provider: 'otp', token: '' }),
      duo: {
        interval: undefined as undefined | number,
        value: 100,
      },
    };
  },

  computed: {
    provider() {
      return this.authData.challenge?.provider;
    },
    deviceId() {
      return this.authData.challenge?.deviceId;
    },
  },

  watch: {
    modelValue: {
      immediate: true,
      async handler(val, oldVal) {
        if (!val || oldVal || !this.authData.challenge)
          return;

        const { provider } = this.authData.challenge;

        if (provider === 'duo') {
          await this.duoTimeoutChallenge();
          return;
        }

        if (provider === 'fido')
          await this.fidoChallenge();
      },
    },
  },

  beforeUnmount() {
    this.clearDuoInterval();
  },

  methods: {
    close() {
      this.$emit('close');
    },

    fail() {
      useMessages().error(this.$t('common.mfa.error'));
      this.close();
    },

    clearDuoInterval() {
      clearInterval(this.duo.interval);
    },

    selectDevice(_deviceId: string) {
      // TODO: implement device selection
      // console.log(deviceId);
    },

    async triggerChallenge() {
      if (!this.authData.challenge)
        return;

      const { challenge } = this.authData;

      await this[`${challenge.provider}Challenge`]();
    },

    async duoTimeoutChallenge() {
      // @ts-expect-error - node types
      this.duo.interval = setInterval(() => {
        this.duo.value -= 20;

        if (this.duo.value === 0) {
          this.clearDuoInterval();
          this.duoChallenge();
        }
      }, 1000);
    },

    async duoChallenge() {
      if (this.authData.challenge?.provider !== 'duo')
        throw new Error('Invalid MFA provider');

      this.clearDuoInterval();
      window.location.href = this.authData.challenge.challengeUrl;
    },

    async fidoChallenge() {
      if (this.authData.challenge?.provider !== 'fido')
        throw new Error('Invalid MFA provider');

      try {
        const { challengeId, provider, options } = this.authData.challenge;
        const response = await startAuthentication(options);
        await this.auth.verify({ challengeId, provider, response });
        await this.finalizeLogin();
      }
      catch {
        useMessages().error(this.$t('common.mfa.error'));
      }
    },

    async otpChallenge() {
      if (this.authData.challenge?.provider !== 'otp')
        throw new Error('Invalid MFA provider');

      const { challengeId, provider } = this.authData.challenge;

      this.otp.challengeId = challengeId;
      this.otp.provider = provider;

      try {
        const { accessToken } = await this.otp.post<LoginResponse>(`admin/auth/${provider}`, {
          withLoading: true,
        });
        await this.auth.successfulLogin(accessToken);
        await this.finalizeLogin();
      }
      catch (err) {
        if (isAxiosError(err) && err.response?.status !== HttpStatusCode.BadRequest)
          this.fail();
      }
    },

    async finalizeLogin() {
      if (!this.auth.loggedIn)
        return;

      await this.$router.push({ name: 'dashboard' });
    },
  },
});
</script>

<style lang="scss">
.provider-icon {
  font-size: 100px !important;
}
</style>
