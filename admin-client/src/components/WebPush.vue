<template>
  <v-alert
    v-if="supported"
    border="left"
    class="my-4"
    color="secondary"
    dark
    dismissible
    outlined
    prominent
    type="info"
  >
    <p class="subtitle-1">Application can send you push notifications.</p>
    <p class="caption">
      Push notifications can let you know when result is ready so you don't have to manually check
      for it. E.g. if you submit a job, which runs in background and is finished later. You don't
      have to re-check the status as you will get notified with push notification.
    </p>
    <v-divider class="my-4 secondary" style="opacity: 0.5"></v-divider>
    <v-row v-if="granted" align="center" no-gutters>
      <v-col class="grow">
        <div class="subtitle-2">
          Push notifications are allowed. You can give it a test to see how it will look like.
        </div>
      </v-col>
      <v-col class="shrink">
        <v-btn v-show="granted" color="primary" @click="push">Test PUSH</v-btn>
      </v-col>
    </v-row>
    <v-row v-else align="center" no-gutters>
      <v-col class="grow">
        <div class="subtitle-2">
          Click on "Allow PUSH" and confirm the notification in browser's pop-up.
        </div>
      </v-col>
      <v-col class="shrink">
        <v-btn v-show="!granted" color="primary" @click="subscribe">Allow PUSH</v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      applicationServerKey: process.env.VUE_APP_WEBPUSH_PUBLIC_KEY as string | undefined,
      permission: null as string | null, // NotificationPermission
    };
  },

  computed: {
    granted(): boolean {
      return this.permission === 'granted';
    },
    supported(): boolean {
      return (
        !!this.applicationServerKey && 'Notification' in window && 'serviceWorker' in navigator
      );
    },
  },

  created() {
    if (!this.supported) {
      console.warn(`Notification or serviceWorker API not supported by browser.`);
      return;
    }

    this.permission = Notification.permission;
  },

  methods: {
    async subscribe() {
      if (!this.supported) return;

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return;

      const { pushManager } = registration;

      let subscription = await pushManager.getSubscription();
      this.permission = await Notification.requestPermission();

      if (this.permission === 'granted' && !subscription) {
        subscription = await pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.applicationServerKey,
        });
        await this.$http.post('/subscriptions', { subscription });
      }
    },

    async push() {
      await this.$http.post('/subscriptions/push');
    },
  },
});
</script>
