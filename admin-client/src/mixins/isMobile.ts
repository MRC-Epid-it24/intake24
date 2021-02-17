import Vue from 'vue';

export default Vue.extend({
  computed: {
    isMobile(): boolean {
      // TODO: confirm the logic when to swap the more mobile/app look
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
});
