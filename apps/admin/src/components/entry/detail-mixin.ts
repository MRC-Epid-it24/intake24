import { defineComponent } from 'vue';

import Layout from './layout.vue';

export default defineComponent({
  name: 'DetailMixin',

  components: { Layout },

  props: {
    id: {
      type: String,
      default: 'create',
    },
  },
});
