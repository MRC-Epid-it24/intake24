import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      refreshing: false,
      registration: null as ServiceWorkerRegistration | null,
      updateExists: false,
    };
  },

  computed: {
    supported(): boolean {
      return 'serviceWorker' in navigator;
    },
  },

  created() {
    if (!this.supported) return;

    // Listen for custom event from the SW registration
    document.addEventListener('swUpdated', this.updateAvailable as EventListener, { once: true });

    // Prevent multiple refreshes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
  },

  methods: {
    // Store the SW registration so we can send it a message
    // To alert the user there is an update they need to refresh for
    updateAvailable(event: CustomEvent<ServiceWorkerRegistration>) {
      this.registration = event.detail;
      this.updateExists = true;
    },

    // Called when the user accepts the update
    refreshApp() {
      this.updateExists = false;
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return;
      // send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    },
  },
});
