import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import { useLoading } from '@intake24/admin/stores';

export default defineComponent({
  computed: mapState(useLoading, { isAppLoading: 'isLoading' }),
});
