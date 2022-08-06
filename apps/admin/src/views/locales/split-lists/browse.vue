<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="save">
    <v-toolbar flat tile color="grey lighten-5" bottom>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('locales.split-lists.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="ml-3"
        color="secondary"
        fab
        small
        :title="$t('locales.split-lists.add')"
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
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model.trim="item.firstWord"
                :label="$t('locales.split-lists.firstWord')"
                hide-details="auto"
                name="firstWord"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md>
              <v-text-field
                v-model.trim="item.words"
                :label="$t('locales.split-lists.words')"
                hide-details="auto"
                name="words"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon :title="$t('locales.split-lists.remove')" @click.stop="remove(idx)">
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
  LocaleSplitList,
  LocaleSplitListInput,
} from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';

export type LocaleSplitListsForm = { items: LocaleSplitListInput[] };

export default defineComponent({
  name: 'LocaleSplitLists',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<LocaleEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      form: form<LocaleSplitListsForm>({ items: [] }, { transform: ({ items }) => items }),
    };
  },

  async mounted() {
    const { data: items } = await this.$http.get<LocaleSplitList[]>(
      `admin/locales/${this.id}/split-lists`
    );

    this.toForm({ items });
  },

  methods: {
    add() {
      this.form.items.push({ localeId: this.id, firstWord: '', words: '' });
    },

    remove(index: number) {
      this.form.items.splice(index, 1);
    },

    async save() {
      this.form.items = this.form.items.filter(({ firstWord, words }) => firstWord && words);

      const items = await this.form.post<LocaleSplitList[]>(`admin/locales/${this.id}/split-lists`);

      this.setEntry({ items });
    },
  },
});
</script>

<style lang="scss" scoped></style>
