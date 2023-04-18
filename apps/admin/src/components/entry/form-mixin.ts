import { defineComponent } from 'vue';

import { ErrorList, SubmitFooter } from '@intake24/admin/components/forms';

import Layout from './layout.vue';

export default defineComponent({
  name: 'FormMixin',

  components: { ErrorList, Layout, SubmitFooter },

  provide: () => ({
    editsResource: true,
  }),

  props: {
    id: {
      type: String,
      default: 'create',
    },
  },
});
