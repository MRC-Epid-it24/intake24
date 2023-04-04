<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="save">
    <v-toolbar bottom color="grey lighten-5" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('locales.synonym-sets.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="ml-3"
        color="secondary"
        fab
        small
        :title="$t('locales.synonym-sets.add')"
        @click.stop="add"
      >
        <v-icon>$add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list>
      <v-list-item v-for="(item, idx) in form.items" :key="idx" class="list-item-border">
        <v-list-item-avatar>
          <v-icon>fas fa-arrows-split-up-and-left</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-text-field
            v-model.trim="item.synonyms"
            hide-details="auto"
            :label="$t('locales.synonym-sets.synonyms')"
            name="synonyms"
            outlined
          ></v-text-field>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon :title="$t('locales.synonym-sets.remove')" @click.stop="remove(idx)">
            <v-icon color="error">$delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type {
  LocaleEntry,
  LocaleSynonymSet,
  LocaleSynonymSetInput,
} from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { createForm } from '@intake24/admin/util';

export type LocaleSynonymSetsForm = { items: LocaleSynonymSetInput[] };

export default defineComponent({
  name: 'LocaleSynonymSets',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<LocaleEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: createForm<LocaleSynonymSetsForm>({ items: [] }, { transform: ({ items }) => items }),
    };
  },

  async mounted() {
    const { data: items } = await this.$http.get<LocaleSynonymSet[]>(
      `admin/locales/${this.id}/synonym-sets`
    );

    this.toForm({ items });
  },

  methods: {
    add() {
      this.form.items.push({ localeId: this.id, synonyms: '' });
    },

    remove(index: number) {
      this.form.items.splice(index, 1);
    },

    async save() {
      this.form.items = this.form.items.filter(({ synonyms }) => synonyms);

      const items = await this.form.post<LocaleSynonymSet[]>(
        `admin/locales/${this.id}/synonym-sets`
      );

      this.setEntry({ items });
    },
  },
});
</script>

<style lang="scss" scoped></style>
