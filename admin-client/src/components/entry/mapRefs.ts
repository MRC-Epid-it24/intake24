import Vue, { VueConstructor } from 'vue';
import { MapRefsMixin } from '@/types/vue';
import { Dictionary } from '@common/types';

export default (Vue as VueConstructor<Vue & MapRefsMixin>).extend({
  computed: {
    refs(): Dictionary {
      return this.$store.state[this.module].entry.refs;
    },
    refsLoaded() {
      return !!Object.keys(this.refs).length;
    },
  },
});
