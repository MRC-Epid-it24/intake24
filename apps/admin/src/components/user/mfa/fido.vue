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
      <v-stepper-vertical-item :complete="step > 2" :title="$t('user.mfa.devices.name.title')" value="2">
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
                  variant="outlined"
                  @update:model-value="form.errors.clear('name')"
                />
                <v-btn block class="my-4" color="secondary" rounded type="submit">
                  {{ $t('user.mfa.devices.verify') }}
                </v-btn>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-vertical-item>
      <v-stepper-vertical-item :complete="step >= 3" :title="$t('user.mfa.devices.registered')" value="3" />
    </template>
  </v-stepper-vertical>
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

  emits: ['registered'],

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
      if (!this.regChallenge)
        return;

      try {
        this.form.response = await startRegistration(this.regChallenge);
        this.progress = 2;
      }
      catch {
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
