import Vue, { VueConstructor } from 'vue';
import { Route } from 'vue-router';
import { copy } from '@intake24/common/util';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { Dictionary, ValidationError } from '@intake24/common/types';
import { FormMixin } from '@intake24/admin/types';
import { form } from '@intake24/admin/helpers';
import SubmitFooter from '@intake24/admin/components/forms/submit-footer.vue';
import fetchEntry from './fetch-entry';
import hasEntry from './has-entry';
import Layout from './layout.vue';
import mapEntry from './map-entry';
import mapRefs from './map-refs';

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'FormMixin',

  components: { Layout, SubmitFooter },

  mixins: [fetchEntry, hasEntry, mapEntry, mapRefs],

  provide: {
    editsResource: true,
  },

  data() {
    return {
      editMethod: 'put',
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
        this.originalEntry = copy(this.form.getData(true));
        return;
      }

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
      const formKeys = this.form.keys;
      const entryKeys = Object.keys(this.originalEntry);
      const commonKeys = entryKeys.filter((key) => formKeys.includes(key));

      const original = pick(this.originalEntry, commonKeys);
      const updated = pick(this.form.getData(true), commonKeys);

      return !isEqual(original, updated);
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
    setOriginalEntry(data: Dictionary) {
      this.originalEntry = copy(data);
    },

    toForm(data: Dictionary) {
      this.setOriginalEntry(data);
      this.form.load(data);
    },

    async submit() {
      let data;

      if (this.isEdit) {
        data = await this.form[this.editMethod](`${this.resource.api}/${this.id}`);

        const { id, name } = data;
        this.$toasted.success(this.$t('common.msg.updated', { name: name ?? id }).toString());
      } else {
        data = await this.form.post(`${this.resource.api}`);

        const { id, name } = data;
        this.$router.push({ name: `${this.resource.name}-edit`, params: { id } });

        this.$toasted.success(this.$t('common.msg.stored', { name: name ?? id }).toString());
      }

      await this.$store.dispatch('resource/entry/update', data);
    },

    clearError(event: KeyboardEvent) {
      const { name } = event.target as HTMLInputElement;

      if (name) this.form.errors.clear(name);
    },
  },
});
