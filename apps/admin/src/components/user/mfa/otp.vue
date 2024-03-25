<template>
  <v-stepper v-model="progress" flat vertical>
    <v-stepper-step :complete="progress > 1" step="1">
      {{ $t('user.mfa.devices.init.title') }}
    </v-stepper-step>
    <v-stepper-content step="1">
      <v-row>
        <v-col cols="12" sm="6">
          <v-btn
            block
            class="my-4"
            color="secondary"
            :loading="!!regChallenge"
            rounded
            @click="challenge"
          >
            {{ $t('user.mfa.devices.init._') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-stepper-content>
    <v-stepper-step :complete="progress > 2" step="2">
      {{ $t('user.mfa.devices.qr.title') }}
    </v-stepper-step>
    <v-stepper-content step="2">
      <v-row>
        <v-col cols="12" order="last" order-sm="first" sm="6">
          <v-form @submit.prevent="verify">
            <v-text-field
              v-model="form.name"
              class="my-2"
              :error-messages="form.errors.get('name')"
              hide-details="auto"
              :label="$t('user.mfa.devices.name._')"
              name="name"
              outlined
              @input="form.errors.clear('name')"
            ></v-text-field>
            <p class="my-2 text-subtitle-2">{{ $t('user.mfa.devices.qr.text') }}</p>
            <v-otp-input
              v-model="form.token"
              :error-messages="form.errors.get('token')"
              hide-details="auto"
              length="6"
              name="token"
              @input="form.errors.clear('token')"
            ></v-otp-input>
            <v-btn block class="my-4" color="secondary" rounded type="submit">
              {{ $t('user.mfa.devices.verify') }}
            </v-btn>
          </v-form>
        </v-col>
        <v-col cols="12" order="first" order-sm="last" sm="6">
          <v-img v-if="regChallenge" :aspect-ratio="1 / 1" :src="regChallenge?.qrCode"></v-img>
        </v-col>
      </v-row>
    </v-stepper-content>
    <v-stepper-step :complete="progress >= 3" step="3">
      {{ $t('user.mfa.devices.registered') }}
    </v-stepper-step>
  </v-stepper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type {
  MFADeviceResponse,
  OTPRegistrationChallenge,
} from '@intake24/common/types/http/admin';
import { createForm } from '@intake24/admin/util';

export default defineComponent({
  name: 'OtpDevice',

  emits: ['registered'],

  data() {
    return {
      url: 'admin/user/mfa/providers/otp',
      progress: 1,
      form: createForm({ challengeId: '', name: 'My OTP device', token: '' }),
      regChallenge: null as OTPRegistrationChallenge | null,
    };
  },

  methods: {
    clear() {
      this.form.reset();
      this.regChallenge = null;
      this.progress = 1;
    },

    async challenge() {
      const { data } = await this.$http.get<OTPRegistrationChallenge>(this.url);

      this.regChallenge = data;
      this.form.challengeId = data.challengeId;

      this.progress = 2;
    },

    async verify() {
      const device = await this.form.post<MFADeviceResponse>(this.url);
      this.$emit('registered', device);

      this.progress = 3;
    },
  },
});
</script>
