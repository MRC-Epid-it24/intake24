import Vue from 'vue';

export default Vue.extend({
  props: {
    id: {
      type: [Number, String],
      default: 'create',
    },
  },
});
