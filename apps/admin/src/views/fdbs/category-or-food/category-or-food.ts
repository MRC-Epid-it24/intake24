import { deepEqual } from 'fast-equals';
import pick from 'lodash/pick';
import { defineComponent } from 'vue';

import type {
  CategoryLocalEntry,
  FoodDatabaseEntry,
  FoodDatabaseRefs,
  FoodLocalEntry,
} from '@intake24/common/types/http/admin';
import { useStoreEntry, watchEntry } from '@intake24/admin/components/entry';
import {
  AttributeList,
  CategoryList,
  PortionSizeMethodList,
} from '@intake24/admin/components/fdbs';
import { createForm } from '@intake24/admin/util';
import { getObjectNestedKeys } from '@intake24/common/util';
import { useMessages } from '@intake24/ui/stores';

export type Entry = CategoryLocalEntry | FoodLocalEntry;

export default defineComponent({
  name: 'CategoryOrFoodEntryMixin',

  components: { AttributeList, CategoryList, PortionSizeMethodList },

  mixins: [watchEntry],

  async beforeRouteUpdate(to, from, next) {
    await this.fetchCategoryOrFood(to.params.entryId);
    next();
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    entryId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { refs } = useStoreEntry<FoodDatabaseEntry, FoodDatabaseRefs>(props);

    return { refs };
  },

  data() {
    return {
      loading: false,
      type: 'categories' as 'categories' | 'foods',
      entry: null as Entry | null,
      form: createForm({}, { extractNestedKeys: true }),
      disabled: !this.can({ action: 'edit' }),
    };
  },

  computed: {
    isEntryLoaded(): boolean {
      return !!this.entry;
    },
    entryChanged(): boolean {
      const formKeys = this.form.allKeys;
      const entryKeys = this.form.config.extractNestedKeys
        ? getObjectNestedKeys(this.originalEntry)
        : Object.keys(this.originalEntry);
      const commonKeys = entryKeys.filter((key) => formKeys.includes(key));

      const original = pick(this.originalEntry, commonKeys);
      const updated = pick(this.form.getData(true), commonKeys);

      return !deepEqual(original, updated);
    },
  },

  async mounted() {
    await this.fetchCategoryOrFood(this.entryId);
  },

  methods: {
    toForm(data: Entry) {
      this.setOriginalEntry(data);
      this.form.load(data);
    },

    async fetchCategoryOrFood(entryId: string) {
      const { id, type } = this;

      if (entryId === 'no-category') return;

      this.loading = true;
      this.entry = null;

      try {
        const { data } = await this.$http.get<Entry>(`admin/fdbs/${id}/${type}/${entryId}`);

        this.toForm(data);
        this.entry = data;
      } finally {
        this.loading = false;
      }
    },

    async submit() {
      const { id, entryId, type } = this;

      const data = await this.form.put<Entry>(`admin/fdbs/${id}/${type}/${entryId}`);
      this.toForm(data);

      const { name, main: { name: englishName = 'record' } = {} } = data;

      useMessages().success(
        this.$t('common.msg.updated', { name: name ?? englishName }).toString()
      );
    },

    clearError(event: KeyboardEvent) {
      const { name } = event.target as HTMLInputElement;

      if (name) this.form.errors.clear(name);
    },
  },
});
