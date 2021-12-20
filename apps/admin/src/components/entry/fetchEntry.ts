import Vue, { VueConstructor } from 'vue';
import { HasEntryMixin } from '@/types';

export default (Vue as VueConstructor<Vue & HasEntryMixin>).extend({
  watch: {
    $route() {
      this.fetch();
    },
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
