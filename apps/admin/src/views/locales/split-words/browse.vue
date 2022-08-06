<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="save">
    <v-toolbar flat tile color="grey lighten-5" bottom>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('locales.split-words.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="ml-3"
        color="secondary"
        fab
        small
        :title="$t('locales.split-words.add')"
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
            v-model="item.words"
            :label="$t('locales.split-words.words')"
            hide-details="auto"
            name="words"
            outlined
          ></v-text-field>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon :title="$t('locales.split-words.remove')" @click.stop="remove(idx)">
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
  LocaleSplitWord,
  LocaleSplitWordInput,
} from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';

export type LocaleSplitWordsForm = { items: LocaleSplitWordInput[] };

export default defineComponent({
  name: 'LocaleSplitWords',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<LocaleEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: form<LocaleSplitWordsForm>({ items: [] }, { transform: ({ items }) => items }),
    };
  },

  async mounted() {
    const { data: items } = await this.$http.get<LocaleSplitWord[]>(
      `admin/locales/${this.id}/split-words`
    );

    this.toForm({ items });
  },

  methods: {
    add() {
      this.form.items.push({ localeId: this.id, words: '' });
    },

    remove(index: number) {
      this.form.items.splice(index, 1);
    },

    async save() {
      this.form.items = this.form.items.filter(({ words }) => words);

      const items = await this.form.post<LocaleSplitWord[]>(`admin/locales/${this.id}/split-words`);

      this.setEntry({ items });
    },
  },
});
</script>

<style lang="scss" scoped></style>
