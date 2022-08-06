import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import { useUser } from '@intake24/admin/stores';

export default defineComponent({
  methods: mapActions(useUser, ['can']),
});
