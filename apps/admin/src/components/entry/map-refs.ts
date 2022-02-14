import Vue from 'vue';
import { mapState } from 'pinia';
import { useEntry } from '@intake24/admin/stores';

export default Vue.extend({
  computed: mapState(useEntry, {
    refs: 'refs',
    refsLoaded: 'refsLoaded',
  }),
});
