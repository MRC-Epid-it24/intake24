import Vue from 'vue';

export default Vue.extend({
  // TODO: confirm the logic when to swap the more mobile/tablet friendly look
  computed: {
    isMobile(): boolean {
      return this.$vuetify.breakpoint.xsOnly;
    },
    isNotDesktop(): boolean {
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },
});
