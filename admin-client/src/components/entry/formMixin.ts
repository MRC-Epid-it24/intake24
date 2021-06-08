import Vue, { VueConstructor } from 'vue';
import { Route } from 'vue-router';
import clone from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { Dictionary, ValidationError } from '@common/types';
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

  provide: {
    editsResource: true,
  },

  data() {
    return {
      form: form({}),
      nonInputErrorKeys: [] as string[],
      originalEntry: {} as Dictionary,
      routeLeave: {
        dialog: false,
        to: null as Route | null,
        confirmed: false,
      },
    };
  },

  watch: {
    entry(val) {
      if (!Object.keys(val).length) return;

      // Creating new record
      // TODO: might be better to load full blank templates directly in store
      if (isEqual(val, { id: null })) {
        this.originalEntry = clone(this.form.getData());
        return;
      }

      this.originalEntry = clone(val);
      this.toForm(val);
    },
  },

  beforeRouteLeave(to, from, next) {
    if (this.routeLeave.confirmed) {
      this.routeLeave = { dialog: false, to: null, confirmed: false };
      next();
      return;
    }

    if (this.entryChanged) {
      this.routeLeave = { dialog: true, to, confirmed: false };
      return;
    }
    next();
  },

  computed: {
    entryChanged(): boolean {
      const original = pick(this.originalEntry, this.form.keys);

      return !isEqual(original, this.form.getData());
    },
    isCreate(): boolean {
      return this.id === 'create';
    },
    isEdit(): boolean {
      return !this.isCreate;
    },
    nonInputErrors(): ValidationError[] {
      return Object.values(pick(this.form.errors.all(), this.nonInputErrorKeys));
    },
  },

  methods: {
    toForm(data: Dictionary) {
      this.form.load(data);
    },

    async submit() {
      if (this.isEdit) {
        const { data, refs } = await this.form.put(`${this.resource.api}/${this.id}`);
        this.toForm(data);

        await this.$store.dispatch('resource/entry/update', { data, refs });

        const { id, name } = data;
        this.$toasted.success(this.$t('common.msg.updated', { name: name ?? id }) as string);
      } else {
        const {
          data: { id, name },
        } = await this.form.post(`${this.resource.api}`);

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
