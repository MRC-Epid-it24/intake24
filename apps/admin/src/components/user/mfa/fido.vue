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
      {{ $t('user.mfa.devices.name.title') }}
    </v-stepper-step>
    <v-stepper-content step="2">
      <v-container>
        <v-row>
          <v-col cols="12" sm="8">
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
              <v-btn block class="my-4" color="secondary" rounded type="submit">
                {{ $t('user.mfa.devices.verify') }}
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-stepper-content>
    <v-stepper-step :complete="progress >= 3" step="3">
      {{ $t('user.mfa.devices.registered') }}
    </v-stepper-step>
  </v-stepper>
</template>

<script lang="ts">
import { startRegistration } from '@simplewebauthn/browser';
import { defineComponent } from 'vue';

import type {
  FIDORegistrationChallenge,
  FIDORegistrationVerificationRequest,
  MFADeviceResponse,
} from '@intake24/common/types/http/admin';
import { createForm } from '@intake24/admin/util';

export interface FIDOForm extends Omit<FIDORegistrationVerificationRequest, 'response'> {
  response: FIDORegistrationVerificationRequest['response'] | null;
}

export default defineComponent({
  name: 'FidoDevice',

  data() {
    return {
      url: 'admin/user/mfa/providers/fido',
      progress: 1,
      form: createForm<FIDOForm>({
        challengeId: '',
        name: 'My FIDO device',
        response: null,
      }),
      regChallenge: null as FIDORegistrationChallenge | null,
    };
  },

  methods: {
    clear() {
      this.form.reset();
      this.regChallenge = null;
      this.progress = 1;
    },

    async challenge() {
      const { data } = await this.$http.get<FIDORegistrationChallenge>(this.url);

      this.regChallenge = data;
      this.form.challengeId = data.challenge;

      await this.startLocalRegistration();
    },

    async startLocalRegistration() {
      if (!this.regChallenge) return;

      try {
        this.form.response = await startRegistration(this.regChallenge);
        this.progress = 2;
      } catch {
        this.regChallenge = null;
      }
    },

    async verify() {
      const device = await this.form.post<MFADeviceResponse>(this.url);
      this.$emit('registered', device);

      this.progress = 3;
    },
  },
});
</script>
