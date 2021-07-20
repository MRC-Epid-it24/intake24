import Vue from 'vue';
import resources from '@/router/resources';
import { Resource } from '@/types';

export default Vue.extend({
  computed: {
    resource(): Resource {
      return resources.find((item) => item.name === this.module) as Resource;
    },
  },
});
