import Vue, { VueConstructor } from 'vue';
import { Dictionary } from '@common/types';
import { MapEntryMixin } from '@/types/vue';

export default (Vue as VueConstructor<Vue & MapEntryMixin>).extend({
  computed: {
    entry(): Dictionary {
      return this.$store.state[this.module].entry.data;
    },
    entryLoaded() {
      return this.entry && !!Object.keys(this.entry).length;
    },
  },
});
