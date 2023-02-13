<template>
  <v-stepper v-model="progress" flat vertical>
    <v-stepper-step :complete="progress > 1" step="1">
      {{ $t('user.mfa.devices.init.title') }}
    </v-stepper-step>
    <v-stepper-content step="1">
      <v-container>
        <v-row>
          <v-col cols="12" sm="8">
            <v-form @submit.prevent="verify">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('user.mfa.devices.name')"
                name="name"
                outlined
                @input="form.errors.clear('name')"
              ></v-text-field>
              <v-btn block class="my-4" color="primary" rounded type="submit">
                {{ $t('user.mfa.devices.init._') }}
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-stepper-content>
    <v-stepper-step :complete="progress >= 2" step="2">
      {{ $t('user.mfa.devices.registered') }}
    </v-stepper-step>
  </v-stepper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { MFADeviceEntry } from '@intake24/common/types/http/admin';
import { form } from '@intake24/admin/helpers';

export default defineComponent({
  name: 'DuoDevice',

  data() {
    return {
      url: 'admin/user/mfa/duo',
      progress: 1,
      form: form({ challengeId: '', name: 'My Duo Device', token: '' }),
    };
  },

  methods: {
    clear() {
      this.form.reset();
      this.progress = 1;
    },

    async verify() {
      const device = await this.form.post<MFADeviceEntry>(this.url);

      this.$emit('registered', device);

      this.progress = 2;
    },
  },
});
</script>
