import { defineComponent } from '@vue/composition-api';
import resources from '@intake24/admin/router/resources';
import { Resource } from '@intake24/admin/types';

export default defineComponent({
  computed: {
    resource(): Resource {
      return resources.find((item) => item.name === this.module) as Resource;
    },
  },
});
