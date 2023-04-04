import { deepEqual } from 'fast-equals';
import pick from 'lodash/pick';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { Dictionary, ValidationError } from '@intake24/common/types';
import { ErrorList, SubmitFooter } from '@intake24/admin/components/forms';
import { useEntry, useMessages } from '@intake24/admin/stores';
import { createForm } from '@intake24/admin/util';
import { copy } from '@intake24/common/util';

import fetchEntry from './fetch-entry';
import Layout from './layout.vue';
import watchEntry from './watch-entry';

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';

export default defineComponent({
  name: 'FormMixin',

  components: { ErrorList, Layout, SubmitFooter },

  mixins: [fetchEntry, watchEntry],

  provide: () => ({
    editsResource: true,
  }),

  data() {
    return {
      editMethod: 'put' as Method,
      form: createForm<Dictionary>({}),
      nonInputErrorKeys: [] as string[],
    };
  },

  computed: {
    entryChanged(): boolean {
      const formKeys = this.form.keys;
      const entryKeys = Object.keys(this.originalEntry);
      const commonKeys = entryKeys.filter((key) => formKeys.includes(key));

      const original = pick(this.originalEntry, commonKeys);
      const updated = pick(this.form.getData(true), commonKeys);

      return !deepEqual(original, updated);
    },
    nonInputErrors(): ValidationError[] {
      return Object.values(pick(this.form.errors.all(), this.nonInputErrorKeys));
    },
  },

  watch: {
    entry(val) {
      if (!Object.keys(val).length) return;

      // Creating new record
      // TODO: might be better to load full blank templates directly in store
      if (deepEqual(val, { id: null })) {
        this.originalEntry = copy(this.form.getData(true));
        return;
      }

      this.toForm(val);
    },
  },

  methods: {
    ...mapActions(useEntry, ['setEntry']),

    toForm(data: Dictionary) {
      this.setOriginalEntry(data);
      this.form.load(data);
    },

    async submit() {
      let data: any;

      if (this.isEdit) {
        data = await this.form[this.editMethod](`${this.resource.api}/${this.id}`);

        const { id, name } = data;
        useMessages().success(this.$t('common.msg.updated', { name: name ?? id }).toString());
      } else {
        data = await this.form.post(`${this.resource.api}`);

        const { id, name } = data;
        await this.$router.push({ name: `${this.resource.name}-edit`, params: { id } });

        useMessages().success(this.$t('common.msg.created', { name: name ?? id }).toString());
      }

      this.setEntry(data);
    },

    clearError(event: KeyboardEvent) {
      const { name } = event.target as HTMLInputElement;

      if (name) this.form.errors.clear(name);
    },
  },
});
