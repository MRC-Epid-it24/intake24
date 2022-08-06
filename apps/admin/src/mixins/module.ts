import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import { useResource } from '../stores';

export default defineComponent({
  computed: mapState(useResource, { module: 'name' }),
});
