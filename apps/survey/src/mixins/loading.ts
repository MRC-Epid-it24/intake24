import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useLoading } from '../stores';

export default defineComponent({
  computed: mapState(useLoading, { isAppLoading: 'isLoading' }),
});
