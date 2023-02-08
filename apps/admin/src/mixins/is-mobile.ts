import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    isMobile(): boolean {
      return this.$vuetify.breakpoint.mobile;
    },
  },
});
