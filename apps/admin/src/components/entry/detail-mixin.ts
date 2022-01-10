import Vue, { VueConstructor } from 'vue';
import { DetailMixin } from '@intake24/admin/types';
import fetchEntry from './fetch-entry';
import hasEntry from './has-entry';
import Layout from './layout.vue';
import mapEntry from './map-entry';
import mapRefs from './map-refs';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'DetailMixin',

  components: { Layout },

  mixins: [fetchEntry, hasEntry, mapEntry, mapRefs],
});
