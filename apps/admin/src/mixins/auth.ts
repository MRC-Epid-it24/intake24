import Vue from 'vue';
import { mapActions } from 'pinia';
import { useUser } from '@intake24/admin/stores';

export default Vue.extend({
  methods: mapActions(useUser, ['can']),
});
