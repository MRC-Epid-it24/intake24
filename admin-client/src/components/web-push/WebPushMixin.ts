import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      permission: null as string | null, // NotificationPermission
    };
  },

  computed: {
    granted(): boolean {
      return this.permission === 'granted';
    },
    supported(): boolean {
      return 'Notification' in window && 'serviceWorker' in navigator;
    },
  },

  async mounted() {
    if (!this.supported) {
      console.warn(`Notification or serviceWorker API not supported by browser.`);
      return;
    }

    this.permission = Notification.permission;
  },

  methods: {
    async requestPermission() {
      if (!this.supported) return;

      this.permission = await Notification.requestPermission();
    },

    async subscribe() {
      if (!this.granted) return;

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return;

      const { pushManager } = registration;

      let subscription = await pushManager.getSubscription();

      if (!subscription) {
        subscription = await pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.VUE_APP_WEBPUSH_PUBLIC_KEY,
        });
      }
      await this.$http.post('/subscriptions', { subscription });
    },
  },
});
