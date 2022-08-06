import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import { useEntry } from '@intake24/admin/stores';

export default defineComponent({
  async beforeRouteUpdate(to, from, next) {
    if (from.params.id === to.params.id) {
      next();
      return;
    }

    await this.fetch(to.params.id);
    next();
  },

  async created() {
    await this.fetch();
  },

  methods: {
    ...mapActions(useEntry, ['requestEntry']),

    async fetch(id?: string): Promise<void> {
      await this.requestEntry({ id: id ?? this.$route.params.id });
    },
  },
});
