import Vue from 'vue';
import { mapState } from 'pinia';
import { useLoading } from '@intake24/admin/stores';

export default Vue.extend({
  computed: mapState(useLoading, { isAppLoading: 'isLoading' }),
});
