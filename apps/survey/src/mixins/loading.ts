import { defineComponent } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useLoading } from '../stores';

export default defineComponent({
  computed: mapState(useLoading, { isAppLoading: 'isLoading' }),
});
