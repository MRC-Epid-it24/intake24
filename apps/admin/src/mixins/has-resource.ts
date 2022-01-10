import Vue from 'vue';
import resources from '@intake24/admin/router/resources';
import { Resource } from '@intake24/admin/types';

export default Vue.extend({
  computed: {
    resource(): Resource {
      return resources.find((item) => item.name === this.module) as Resource;
    },
  },
});
