import Vue from 'vue';
import hasResource from '@/mixins/has-resource';

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: 'create',
    },
  },

  mixins: [hasResource],
});
