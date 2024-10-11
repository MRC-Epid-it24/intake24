<template>
  <v-stepper-vertical v-model="progress" flat hide-actions>
    <template #default="{ step }">
      <v-stepper-vertical-item :complete="step > 1" :title="$t('user.mfa.devices.init.title')" value="1">
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
      </v-stepper-vertical-item>
      <v-stepper-vertical-item :complete="step > 2" :title="$t('user.mfa.devices.qr.title')" value="2">
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
                variant="outlined"
                @update:model-value="form.errors.clear('name')"
              />
              <p class="my-2 text-subtitle-2">
                {{ $t('user.mfa.devices.qr.text') }}
              </p>
              <v-otp-input
                v-model="form.token"
                :error-messages="form.errors.get('token')"
                hide-details="auto"
                length="6"
                name="token"
                @input="form.errors.clear('token')"
              />
              <v-btn block class="my-4" color="secondary" rounded type="submit">
                {{ $t('user.mfa.devices.verify') }}
              </v-btn>
            </v-form>
          </v-col>
          <v-col cols="12" order="first" order-sm="last" sm="6">
            <v-img v-if="regChallenge" :aspect-ratio="1 / 1" :src="regChallenge?.qrCode" />
          </v-col>
        </v-row>
      </v-stepper-vertical-item>
      <v-stepper-vertical-item :complete="step >= 3" :title="$t('user.mfa.devices.registered')" value="3" />
    </template>
  </v-stepper-vertical>
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
