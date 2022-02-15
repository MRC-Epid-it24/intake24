import { defineComponent } from '@vue/composition-api';
import hasResource from '@intake24/admin/mixins/has-resource';

export default defineComponent({
  props: {
    id: {
      type: String,
      default: 'create',
    },
  },

  mixins: [hasResource],
});
