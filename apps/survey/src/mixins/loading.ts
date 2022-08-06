import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import { useLoading } from '../stores';

export default defineComponent({
  computed: mapState(useLoading, { isAppLoading: 'isLoading' }),
});
