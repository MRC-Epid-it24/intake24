import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  computed: {
    isMobile(): boolean {
      // TODO: confirm the logic when to swap the more mobile/app look
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
});
