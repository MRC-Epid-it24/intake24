<template>
  <div>
    <v-subheader>{{ $t('user.mfa.title') }}</v-subheader>
    <v-card-text class="d-flex flex-row align-center justify-space-between">
      <v-switch
        v-model="status"
        class="my-auto"
        :disabled="!devices.length"
        hide-details="auto"
        :label="$t(`user.mfa.${status ? 'disable' : 'enable'}`)"
        name="status"
        @change="toggle"
      ></v-switch>
      <v-alert v-if="!devices.length" class="my-auto ml-4" dense text type="info">
        {{ $t('user.mfa.disabled') }}
      </v-alert>
    </v-card-text>
    <v-toolbar dense flat>
      <v-toolbar-title>
        {{ $t('user.mfa.devices.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" :fullscreen="isMobile" max-width="600px">
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            color="primary"
            outlined
            rounded
            :title="$t('user.mfa.devices.add')"
            v-on="on"
          >
            <v-icon left>$add</v-icon>
            {{ $t('user.mfa.devices.add') }}
          </v-btn>
        </template>
        <v-card :tile="isMobile">
          <v-toolbar color="primary" dark flat>
            <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
              <v-icon>$cancel</v-icon>
            </v-btn>
            <v-toolbar-title>
              {{ $t('user.mfa.devices.add') }}
            </v-toolbar-title>
          </v-toolbar>
          <v-tabs v-model="tab" background-color="primary" dark grow @change="clear">
            <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="provider in providers" :key="provider" :href="`#${provider}`">
              <v-icon left>{{ `$${provider}` }}</v-icon>
              {{ $t(`user.mfa.providers.${provider}._`) }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="provider in providers" :key="provider" :value="provider">
              <v-card flat>
                <v-card-title class="text-h5 font-weight-bold mb-2">
                  {{ $t(`user.mfa.providers.${provider}.title`) }}
                </v-card-title>
                <v-card-subtitle>
                  {{ $t(`user.mfa.providers.${provider}.description`) }}
                </v-card-subtitle>
                <component :is="provider" ref="providerRefs" @registered="add"></component>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-list flat>
      <transition-group v-if="devices.length" name="drag-and-drop" type="transition">
        <template v-for="(device, idx) in devices">
          <v-list-item :key="device.id" link>
            <v-list-item-avatar>
              <v-icon :title="$t(`user.mfa.providers.${device.provider}._`)">
                {{ `$${device.provider}` }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ device.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ $t(`user.mfa.providers.${device.provider}.title`) }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-chip v-if="device.preferred" color="primary" outlined>
                {{ $t('user.mfa.devices.preferred._') }}
              </v-chip>
              <confirm-dialog
                v-else
                color="primary"
                icon
                icon-left="far fa-circle-up"
                :label="$t('user.mfa.devices.preferred.promote').toString()"
                @confirm="promote(device.id, idx)"
              >
                {{ $t('user.mfa.devices.preferred.promoteConfirm', { name: device.name }) }}
              </confirm-dialog>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('user.mfa.devices.remove').toString()"
                @confirm="remove(device.id)"
              >
                {{ $t('common.action.confirm.delete', { name: device.name }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="idx + 1 < devices.length" :key="`div-${device.id}`"></v-divider>
        </template>
      </transition-group>
      <v-list-item v-else>
        <v-list-item-content>
          <v-list-item-title>{{ $t('user.mfa.devices.none') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { isAxiosError } from 'axios';
import { defineComponent, ref } from 'vue';

import type { MFADeviceEntry, MFADevicesResponse } from '@intake24/common/types/http/admin';
import { useMessages } from '@intake24/admin/stores';
import { mfaProviders } from '@intake24/common/security';
import { ConfirmDialog } from '@intake24/ui';

import Duo from './duo.vue';
import Fido from './fido.vue';
import Otp from './otp.vue';

export default defineComponent({
  name: 'UserMFA',

  components: { ConfirmDialog, Duo, Otp, Fido },

  setup() {
    const providerRefs = ref<InstanceType<typeof Otp | typeof Fido | typeof Duo>[]>();

    return { providerRefs };
  },

  data() {
    return {
      dialog: false,
      tab: mfaProviders[0],
      status: false,
      devices: [] as MFADeviceEntry[],
      providers: mfaProviders,
    };
  },

  async mounted() {
    const {
      data: { status, devices },
    } = await this.$http.get<MFADevicesResponse>('admin/user/mfa');

    this.status = status;
    this.devices = devices;

    await this.checkDuoRegistrationResponse();
  },

  methods: {
    async checkDuoRegistrationResponse() {
      const { state: challengeId, code: token } = this.$route.query;
      if (typeof challengeId !== 'string' || typeof token !== 'string') return;

      this.tab = 'duo';
      this.dialog = true;
    },

    async toggle() {
      if (!this.devices.length) {
        useMessages().info(this.$t('user.mfa.devices.none').toString());
        return;
      }

      try {
        await this.$http.post('admin/user/mfa/toggle', { status: this.status });
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 403) {
          useMessages().info(this.$t('user.mfa.devices.none').toString());
          return;
        }

        throw err;
      }
    },

    async promote(id: string, idx: number) {
      const { data } = await this.$http.patch<MFADeviceEntry>(`admin/user/mfa/${id}`, {
        preferred: true,
      });
      this.devices[0].preferred = false;
      this.devices.splice(idx, 1);
      this.devices.splice(0, 0, data);
    },

    add(device: MFADeviceEntry) {
      this.devices.push(device);
    },

    async remove(deviceId: string) {
      await this.$http.delete(`admin/user/mfa/${deviceId}`);
      this.devices = this.devices.filter((device) => device.id !== deviceId);

      const preferred = this.devices.length && this.devices.find((device) => device.preferred);
      if (!preferred) {
        const { data } = await this.$http.patch<MFADeviceEntry>(
          `admin/user/mfa/${this.devices[0].id}`,
          { preferred: true }
        );
        this.devices.splice(0, 1, data);
      }
    },

    clear() {
      this.providerRefs?.forEach((item) => item.clear());
    },

    close() {
      this.clear();
      this.dialog = false;
    },
  },
});
</script>
