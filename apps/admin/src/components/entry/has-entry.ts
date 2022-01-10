import Vue from 'vue';
import hasResource from '@intake24/admin/mixins/has-resource';

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: 'create',
    },
  },

  mixins: [hasResource],
});
