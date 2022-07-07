import { defineComponent } from 'vue';
import fetchEntry from './fetch-entry';
import hasEntry from './has-entry';
import Layout from './layout.vue';
import mapRefs from './map-refs';

export default defineComponent({
  name: 'DetailMixin',

  components: { Layout },

  mixins: [fetchEntry, hasEntry, mapRefs],
});
