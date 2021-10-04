<template>
  <v-alert
    v-if="isWebPushSupported"
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
    <v-row v-if="isPermissionGranted" align="center" no-gutters>
      <v-col class="grow">
        <div class="subtitle-2">
          Push notifications are allowed. You can give it a test to see how it will look like.
        </div>
      </v-col>
      <v-col class="shrink">
        <v-btn color="primary" @click="testWebPush">Test PUSH</v-btn>
      </v-col>
    </v-row>
    <v-row v-else align="center" no-gutters>
      <v-col class="grow">
        <div class="subtitle-2">
          Click on "Allow PUSH" and confirm the notification in browser's pop-up.
        </div>
      </v-col>
      <v-col class="shrink">
        <v-btn color="primary" @click="requestPermission">Allow PUSH</v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import WebPushMixin from './WebPushMixin';

type Mixins = InstanceType<typeof WebPushMixin>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'WebPush',

  mixins: [WebPushMixin],

  methods: {
    async requestPermission() {
      if (!this.isWebPushSupported) return;

      this.permission = await Notification.requestPermission();

      if (this.isPermissionGranted) await this.subscribe();
    },

    async testWebPush() {
      await this.$http.post('subscriptions/push');
    },
  },
});
</script>
