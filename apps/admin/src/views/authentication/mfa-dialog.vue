<template>
  <v-dialog v-bind="{ modelValue }" :fullscreen="$vuetify.display.smAndDown" max-width="600px">
    <v-card :tile="$vuetify.display.smAndDown">
      <v-toolbar color="secondary">
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
                    v-model="otp.data.value.token"
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
            v-model:selected="deviceId"
            class="list-border"
            lines="two"
            @update:selected="selectDevice"
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
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useForm } from '@intake24/admin/composables';
import { useAuth, useMessages } from '@intake24/admin/stores';
import type { LoginResponse, MFAAuthResponse } from '@intake24/common/types/http';
import { useI18n } from '@intake24/i18n';

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

  setup(props, { emit }) {
    const auth = useAuth();
    const router = useRouter();
    const { i18n: { t } } = useI18n();

    const otp = useForm({ data: { challengeId: '', provider: 'otp', token: '' } });
    const duo = ref({
      interval: undefined as undefined | number,
      value: 100,
    });

    const provider = computed(() => props.authData.challenge?.provider);
    const deviceId = computed(() => props.authData.challenge?.deviceId);

    function close() {
      emit('close');
    };

    function fail() {
      useMessages().error(t('common.mfa.error'));
      close();
    };

    function clearDuoInterval() {
      clearInterval(duo.value.interval);
    };

    function selectDevice(_deviceId: string) {
      // TODO: implement device selection
      // console.log(deviceId);
    };

    async function duoTimeoutChallenge() {
      // @ts-expect-error - node types
      duo.value.interval = setInterval(() => {
        duo.value.value -= 20;

        if (duo.value.value === 0) {
          clearDuoInterval();
          duoChallenge();
        }
      }, 1000);
    };

    async function duoChallenge() {
      if (props.authData.challenge?.provider !== 'duo')
        throw new Error('Invalid MFA provider');

      clearDuoInterval();
      window.location.href = props.authData.challenge.challengeUrl;
    };

    async function fidoChallenge() {
      if (props.authData.challenge?.provider !== 'fido')
        throw new Error('Invalid MFA provider');

      try {
        const { challengeId, provider, options } = props.authData.challenge;
        const response = await startAuthentication({ optionsJSON: options });
        await auth.verify({ challengeId, provider, response });
        await finalizeLogin();
      }
      catch {
        useMessages().error(t('common.mfa.error'));
      }
    };

    async function otpChallenge() {
      if (props.authData.challenge?.provider !== 'otp')
        throw new Error('Invalid MFA provider');

      const { challengeId, provider } = props.authData.challenge;

      otp.data.value.challengeId = challengeId;
      otp.data.value.provider = provider;

      try {
        const { accessToken } = await otp.post<LoginResponse>(`admin/auth/${provider}`, {
          withLoading: true,
        });
        await auth.successfulLogin(accessToken);
        await finalizeLogin();
      }
      catch (err) {
        if (isAxiosError(err) && err.response?.status !== HttpStatusCode.BadRequest)
          fail();
      }
    };

    const challenges = {
      duo: duoChallenge,
      fido: fidoChallenge,
      otp: otpChallenge,
    };

    async function triggerChallenge() {
      if (!props.authData.challenge)
        return;

      const { challenge } = props.authData;

      await challenges[challenge.provider]();
    };

    async function finalizeLogin() {
      if (!auth.loggedIn)
        return;

      await router.push({ name: 'dashboard' });
    };

    onBeforeUnmount(() => {
      clearDuoInterval();
    });

    watch(() => props.modelValue, async (val, oldVal) => {
      if (!val || oldVal || !props.authData.challenge)
        return;

      const { provider } = props.authData.challenge;

      if (provider === 'duo') {
        await duoTimeoutChallenge();
        return;
      }

      if (provider === 'fido')
        await fidoChallenge();
    }, { immediate: true });

    return {
      close,
      deviceId,
      duo,
      provider,
      selectDevice,
      otp,
      duoChallenge,
      fidoChallenge,
      otpChallenge,
      triggerChallenge,
    };
  },
});
</script>

<style lang="scss">
.provider-icon {
  font-size: 100px !important;
}
</style>
