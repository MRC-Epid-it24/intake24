import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    isMobile(): boolean {
      // TODO: confirm the logic when to swap the more mobile/app look
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
});
