import Vue from 'vue';

export default Vue.extend({
  computed: {
    isNotDesktop(): boolean {
      // TODO: confirm the logic when to swap the more mobile/tablet friendly look
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },
});
