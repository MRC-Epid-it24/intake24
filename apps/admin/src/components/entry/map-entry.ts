import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: mapGetters({
    entry: 'resource/entry/data',
    entryLoaded: 'resource/entry/dataLoaded',
  }),
});
