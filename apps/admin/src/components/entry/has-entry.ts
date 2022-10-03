import { defineComponent } from 'vue';

import { resource } from '@intake24/admin/mixins';

export default defineComponent({
  mixins: [resource],

  props: {
    id: {
      type: String,
      default: 'create',
    },
  },

  computed: {
    currentAction(): string {
      return this.$route.meta?.action;
    },
    isCreate(): boolean {
      return this.id === 'create';
    },
    isEdit(): boolean {
      return !this.isCreate;
    },
  },
});
