import Vue from 'vue';
import { mapActions } from 'pinia';
import { useLoading } from '@intake24/admin/stores';

export default Vue.extend({
  methods: {
    ...mapActions(useLoading, {
      addLoading: 'addItem',
      removeLoading: 'removeItem',
      resetLoading: 'reset',
    }),

    async withLoading<T = any>(promise: Promise<T>, id = null) {
      const name = `${this.module}/${id ?? Math.round(Math.random() * 100)}`;
      await this.addLoading(name);
      try {
        return await promise;
      } finally {
        await this.removeLoading(name);
      }
    },
  },
});
