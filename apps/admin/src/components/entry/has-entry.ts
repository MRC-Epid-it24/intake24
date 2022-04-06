import { defineComponent } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useEntry } from '@intake24/admin/stores';
import hasResource from '@intake24/admin/mixins/has-resource';

export default defineComponent({
  props: {
    id: {
      type: String,
      default: 'create',
    },
  },

  mixins: [hasResource],

  computed: {
    ...mapState(useEntry, {
      entry: 'data',
      entryLoaded: 'dataLoaded',
    }),
    isCreate(): boolean {
      return this.id === 'create';
    },
    isEdit(): boolean {
      return !this.isCreate;
    },
  },

  methods: {
    canHandleEntry(action: string): boolean {
      if (this.isCreate) return false;

      const { securables, ownerId } = this.entry;

      return this.can({ action, securables, ownerId });
    },
  },
});
