import { defineComponent } from '@vue/composition-api';
import { mapGetters } from 'vuex';

export default defineComponent({
  computed: mapGetters('loading', { isAppLoading: 'isLoading' }),
});
