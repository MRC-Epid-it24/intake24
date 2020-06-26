import Vue, { VueConstructor } from 'vue';
import { AnyDictionary } from '@common/types/common';
import { MapEntryMixin } from '@/types/vue';

export default (Vue as VueConstructor<Vue & MapEntryMixin>).extend({
  computed: {
    entry(): AnyDictionary {
      return this.$store.state[this.module].entry.data;
    },
    entryLoaded() {
      return this.entry && !!Object.keys(this.entry).length;
    },
  },
});
