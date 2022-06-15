import type { VueConstructor } from 'vue';
import Vue from 'vue';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import type { CategoryLocalEntry, FoodLocalEntry } from '@intake24/common/types/http/admin';
import { form } from '@intake24/admin/helpers';
import watchEntry from '@intake24/admin/components/entry/watch-entry';
import { getObjectNestedKeys } from '@intake24/common/util';

type Mixins = InstanceType<typeof watchEntry>;

export type Entry = CategoryLocalEntry | FoodLocalEntry;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'CategoryOrFoodEntryMixin',

  mixins: [watchEntry],

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

  data() {
    return {
      loading: false,
      type: 'categories' as 'categories' | 'foods',
      entry: null as Entry | null,
      form: form({}, { extractNestedKeys: true }),
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

      return !isEqual(original, updated);
    },
  },

  async beforeRouteUpdate(to, from, next) {
    await this.fetchCategoryOrFood(to.params.entryId);
    next();
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

      this.$toasted.success(
        this.$t('common.msg.updated', { name: name ?? englishName }).toString()
      );
    },

    clearError(event: KeyboardEvent) {
      const { name } = event.target as HTMLInputElement;

      if (name) this.form.errors.clear(name);
    },
  },
});
