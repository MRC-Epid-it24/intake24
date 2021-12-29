import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: mapGetters({
    refs: 'resource/entry/refs',
    refsLoaded: 'resource/entry/refsLoaded',
  }),
});
