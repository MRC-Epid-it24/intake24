import Vue from 'vue';
import ResourceMixin from '@/mixins/ResourceMixin';

export default Vue.extend({
  props: {
    id: {
      type: [Number, String],
      default: 'create',
    },
  },

  mixins: [ResourceMixin],
});
