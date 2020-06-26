import Vue, { VueConstructor } from 'vue';
import { AnyDictionary } from '@common/types/common';
import { FormMixin } from '@/types/vue';
import Form from '@/helpers/Form';
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
      form: new Form({}),
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
    toForm(data: AnyDictionary) {
      this.form.load(data);
    },

    async onSubmit() {
      // TODO: TS 3.9 throws error here. Watch out for this - calling vue.js computed props
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (this.isEdit) {
        const { data } = await this.form.put(`v3/admin/${this.apiUrl}/${this.id}`);
        this.toForm(data);
        this.$toasted.success(
          this.$t('common.msg.updated', { name: data.name ?? data.id }) as string
        );
      } else {
        const {
          data: { id, name },
        } = await this.form.post(`v3/admin/${this.apiUrl}`);
        this.$router.push({ name: `${this.module}-edit`, params: { id } });
        this.$toasted.success(this.$t('common.msg.stored', { name: name ?? id }) as string);
      }
    },
  },
});
