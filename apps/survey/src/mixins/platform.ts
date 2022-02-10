import { defineComponent } from '@vue/composition-api';

export default defineComponent({
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
