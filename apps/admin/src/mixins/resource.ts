import { defineComponent } from 'vue';

import type { Resource } from '@intake24/admin/types';
import resources from '@intake24/admin/router/resources';

export default defineComponent({
  computed: {
    resource(): Resource {
      return resources.find((item) => item.name === this.module) as Resource;
    },
  },
});
