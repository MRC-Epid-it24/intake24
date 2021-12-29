import Vue from 'vue';
import ResourceMixin from '@/mixins/resource-mixin';

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: 'create',
    },
  },

  mixins: [ResourceMixin],
});
