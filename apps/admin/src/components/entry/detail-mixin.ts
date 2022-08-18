import { defineComponent } from 'vue';

import fetchEntry from './fetch-entry';
import Layout from './layout.vue';

export default defineComponent({
  name: 'DetailMixin',

  components: { Layout },

  mixins: [fetchEntry],
});
