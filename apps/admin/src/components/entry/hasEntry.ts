import Vue from 'vue';
import ResourceMixin from '@/mixins/ResourceMixin';

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: 'create',
    },
  },

  mixins: [ResourceMixin],
});
