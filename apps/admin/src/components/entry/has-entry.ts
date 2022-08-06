import { defineComponent } from 'vue';

import { resource } from '@intake24/admin/mixins';

export default defineComponent({
  props: {
    id: {
      type: String,
      default: 'create',
    },
  },

  mixins: [resource],

  computed: {
    isCreate(): boolean {
      return this.id === 'create';
    },
    isEdit(): boolean {
      return !this.isCreate;
    },
  },
});
