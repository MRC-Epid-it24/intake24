import Vue, { VueConstructor } from 'vue';
import { mapActions } from 'pinia';
import { HasEntryMixin } from '@intake24/admin/types';
import { useEntry } from '@intake24/admin/stores';

export default (Vue as VueConstructor<Vue & HasEntryMixin>).extend({
  async beforeRouteUpdate(to, from, next) {
    if (from.params.id === to.params.id) {
      next();
      return;
    }

    await this.fetch();
    next();
  },

  async created() {
    await this.fetch();
  },

  methods: {
    ...mapActions(useEntry, ['requestEntry']),

    async fetch(): Promise<void> {
      await this.requestEntry({ id: this.id });
    },
  },
});
