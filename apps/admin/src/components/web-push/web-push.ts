import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      permission: null as string | null, // NotificationPermission
    };
  },

  computed: {
    isPermissionGranted(): boolean {
      return this.permission === 'granted';
    },
    isWebPushSupported(): boolean {
      const { protocol, hostname } = window.location;

      return (
        (hostname === 'localhost' || protocol === 'https:')
        && 'Notification' in window
        && 'serviceWorker' in navigator
      );
    },
  },

  async mounted() {
    if (!this.isWebPushSupported) {
      console.warn(`Notification or serviceWorker API not supported by browser.`);
      return;
    }

    this.permission = Notification.permission;
  },

  methods: {
    async requestPermission() {
      if (!this.isWebPushSupported)
        return;

      this.permission = await Notification.requestPermission();
    },

    async subscribe() {
      if (!this.isPermissionGranted)
        return;

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration)
        return;

      const { pushManager } = registration;

      let subscription = await pushManager.getSubscription();

      if (!subscription) {
        subscription = await pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_WEBPUSH_PUBLIC_KEY,
        });
      }
      await this.$http.post('subscriptions', { subscription });
    },
  },
});
