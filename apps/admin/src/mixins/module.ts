import { defineComponent } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useResource } from '../stores';

export default defineComponent({
  computed: mapState(useResource, { module: 'name' }),
});
