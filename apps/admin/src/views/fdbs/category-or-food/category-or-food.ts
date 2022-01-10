import Vue from 'vue';
import { CategoryLocalEntry, FoodLocalEntry } from '@intake24/common/types/http/admin';
import { form } from '@intake24/admin/helpers';

export type Entry = CategoryLocalEntry | FoodLocalEntry;

export default Vue.extend({
  name: 'CategoryOrFoodEntryMixin',

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
      form: form({}),
    };
  },

  computed: {
    isEntryLoaded(): boolean {
      return !!this.entry;
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
      this.form.load(data);
    },

    async fetchCategoryOrFood(entryId: string) {
      const { id, type } = this;

      if (entryId === 'no-category') return;

      this.loading = true;

      try {
        const { data } = await this.$http.get<Entry>(`admin/fdbs/${id}/${type}/${entryId}`);

        this.form.load(data);
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
