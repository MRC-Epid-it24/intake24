import { defineComponent } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useEntry } from '@intake24/admin/stores';

export default defineComponent({
  computed: mapState(useEntry, {
    entry: 'data',
    entryLoaded: 'dataLoaded',
  }),
});
