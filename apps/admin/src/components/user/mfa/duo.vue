<template>
  <v-stepper-vertical v-model="progress" flat hide-actions>
    <template #default="{ step }">
      <v-stepper-vertical-item :complete="step > 1" :title="$t('user.mfa.devices.init.title')" value="1">
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn block class="my-4" color="secondary" rounded @click="challenge">
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
import { defineComponent } from 'vue';

import type {
  DuoRegistrationChallenge,
  MFADeviceResponse,
} from '@intake24/common/types/http/admin';
import { createForm } from '@intake24/admin/util';

export default defineComponent({
  name: 'DuoDevice',

  emits: ['registered'],

  data() {
    return {
      url: 'admin/user/mfa/providers/duo',
      progress: 1,
      form: createForm({ challengeId: '', name: 'My Duo Device', token: '' }),
    };
  },

  mounted() {
    this.loadDuoRegistration();
  },

  methods: {
    async loadDuoRegistration() {
      const { state: challengeId, code: token } = this.$route.query;
      if (typeof challengeId !== 'string' || typeof token !== 'string')
        return;

      this.form.challengeId = challengeId;
      this.form.token = token;
      this.progress = 2;
    },

    clear() {
      this.form.reset();
      this.progress = 1;
    },

    async challenge() {
      const {
        data: { challengeUrl },
      } = await this.$http.get<DuoRegistrationChallenge>(this.url);

      window.location.href = challengeUrl;
    },

    async verify() {
      const device = await this.form.post<MFADeviceResponse>(this.url);

      this.$emit('registered', device);
      this.$router.replace({ query: {} });

      this.progress = 3;
    },
  },
});
</script>
