<template>
  <v-snackbar :value="offlineReady || needRefresh" :timeout="-1" color="primary">
    {{ $t('common.sw.check') }}
    <template v-slot:action="{ attrs }">
      <v-btn dark text v-bind="attrs" @click="updateServiceWorker">
        {{ $t('common.sw.update') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import type { registerSW } from 'virtual:pwa-register';

export type UpdateSW = ReturnType<typeof registerSW>;

export default defineComponent({
  name: 'ServiceWorker',

  data() {
    return {
      updateSW: undefined as UpdateSW | undefined,
      offlineReady: false,
      needRefresh: false,
    };
  },

  async mounted() {
    try {
      const { registerSW } = await import('virtual:pwa-register');

      this.updateSW = registerSW({
        immediate: true,
        onOfflineReady: () => {
          this.offlineReady = true;
          this.onOfflineReadyFn();
        },
        onNeedRefresh: () => {
          this.needRefresh = true;
          this.onNeedRefreshFn();
        },
        onRegistered: (swRegistration) => {
          swRegistration && this.handleSWManualUpdates(swRegistration);
        },
        onRegisterError: (e) => {
          this.handleSWRegisterError(e);
        },
      });
    } catch {
      console.log('sw: PWA disabled.');
    }
  },

  methods: {
    async closePromptUpdateSW() {
      this.offlineReady = false;
      this.needRefresh = false;
    },
    onOfflineReadyFn() {
      console.log('sw: onOfflineReady.');
    },
    onNeedRefreshFn() {
      console.log('sw: New content is available.');
    },
    updateServiceWorker() {
      this.updateSW && this.updateSW(true);
    },
    handleSWManualUpdates(swRegistration: ServiceWorkerRegistration) {
      console.log('sw: Service worker has been registered.');
    },
    handleSWRegisterError(error: any) {
      if (error instanceof Error) {
        const { message, name, stack } = error;
        console.warn('sw: ServiceWorker registration has failed.');
        console.warn(stack ?? `${name}: ${message}`);
        return;
      }
      console.warn('sw: ServiceWorker registration has failed.', error);
    },
  },
});
</script>