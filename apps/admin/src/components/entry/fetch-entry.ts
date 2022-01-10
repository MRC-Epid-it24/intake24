import Vue, { VueConstructor } from 'vue';
import { HasEntryMixin } from '@intake24/admin/types';

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
    this.fetch();
  },

  methods: {
    async fetch(): Promise<void> {
      await this.$store.dispatch(`resource/entry/request`, { id: this.id });
    },
  },
});
