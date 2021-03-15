import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  methods: {
    ...mapActions('loading', {
      addLoading: 'add',
      removeLoading: 'remove',
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
