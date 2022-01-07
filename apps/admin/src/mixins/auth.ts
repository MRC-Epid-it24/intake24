import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: mapGetters('user', ['can']),
});
