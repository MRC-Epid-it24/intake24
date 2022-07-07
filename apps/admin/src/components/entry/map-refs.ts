import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useEntry } from '@intake24/admin/stores';

export default defineComponent({
  computed: mapState(useEntry, {
    refs: 'refs',
    refsLoaded: 'refsLoaded',
  }),
});
