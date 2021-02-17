import Vue, { VueConstructor } from 'vue';
import { Dictionary } from '@common/types';
import { FormMixin } from '@/types/vue';
import form from '@/helpers/Form';
import SubmitFooter from '@/components/forms/SubmitFooter.vue';
import fetchEntry from './fetchEntry';
import hasEntry from './hasEntry';
import Layout from './Layout.vue';
import mapEntry from './mapEntry';
import mapRefs from './mapRefs';

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'Form',

  components: { Layout, SubmitFooter },

  mixins: [fetchEntry, hasEntry, mapEntry, mapRefs],

  data() {
    return {
      form: form({}),
    };
  },

  watch: {
    entry: {
      handler() {
        this.toForm(this.entry);
      },
      // immediate: true,
    },
  },

  computed: {
    apiUrl(): string {
      return this.module;
    },
    isCreate(): boolean {
      return this.id === 'create';
    },
    isEdit(): boolean {
      return !this.isCreate;
    },
  },

  methods: {
    toForm(data: Dictionary) {
      this.form.load(data);
    },

    async onSubmit() {
      if (this.isEdit) {
        const { data } = await this.form.put(`admin/${this.apiUrl}/${this.id}`);
        this.toForm(data);

        const { id, name } = data;
        this.$toasted.success(this.$t('common.msg.updated', { name: name ?? id }) as string);
      } else {
        const {
          data: { id, name },
        } = await this.form.post(`admin/${this.apiUrl}`);
        this.$router.push({ name: `${this.module}-edit`, params: { id } });

        this.$toasted.success(this.$t('common.msg.stored', { name: name ?? id }) as string);
      }
    },

    clearError(event: KeyboardEvent) {
      const { name } = event.target as HTMLInputElement;

      if (name) this.form.errors.clear(name);
    },
  },
});
