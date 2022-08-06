import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import { useLoading } from '@intake24/admin/stores';

export default defineComponent({
  methods: {
    ...mapActions(useLoading, {
      addLoading: 'addItem',
      removeLoading: 'removeItem',
      resetLoading: 'reset',
    }),

    async withLoading<T = any>(promise: Promise<T>, id = null) {
      const name = `${this.module}/${id ?? Math.round(Math.random() * 100)}`;
      this.addLoading(name);
      try {
        return await promise;
      } finally {
        this.removeLoading(name);
      }
    },
  },
});
