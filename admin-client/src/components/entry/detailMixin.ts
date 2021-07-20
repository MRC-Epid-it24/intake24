import Vue, { VueConstructor } from 'vue';
import { DetailMixin } from '@/types';
import fetchEntry from './fetchEntry';
import hasEntry from './hasEntry';
import Layout from './Layout.vue';
import mapEntry from './mapEntry';
import mapRefs from './mapRefs';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'Show',

  components: { Layout },

  mixins: [fetchEntry, hasEntry, mapEntry, mapRefs],
});
