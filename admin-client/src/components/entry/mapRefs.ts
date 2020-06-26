import Vue, { VueConstructor } from 'vue';
import { MapRefsMixin } from '@/types/vue';
import { AnyDictionary } from '@common/types/common';

export default (Vue as VueConstructor<Vue & MapRefsMixin>).extend({
  computed: {
    refs(): AnyDictionary {
      return this.$store.state[this.module].entry.refs;
    },
    refsLoaded() {
      return !!Object.keys(this.refs).length;
    },
  },
});
