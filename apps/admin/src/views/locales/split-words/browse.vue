<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="save">
    <v-toolbar bottom color="grey lighten-5" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('locales.split-words.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="ml-3"
        color="primary"
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
            hide-details="auto"
            :label="$t('locales.split-words.words')"
            name="words"
            outlined
          ></v-text-field>
        </v-list-item-content>
        <v-list-item-action>
          <confirm-dialog
            color="error"
            icon
            icon-left="$delete"
            :label="$t('locales.split-words.remove').toString()"
            @confirm="remove(idx)"
          >
            {{ $t('common.action.confirm.delete', { name: item.words }) }}
          </confirm-dialog>
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
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { useEntry as useStoreEntry } from '@intake24/admin/stores';
import { ConfirmDialog } from '@intake24/ui';

export type LocaleSplitWordsForm = { items: LocaleSplitWordInput[] };

export default defineComponent({
  name: 'LocaleSplitWords',

  components: { ConfirmDialog },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<LocaleEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit, toForm } = useEntryForm<
      LocaleSplitWordsForm,
      LocaleEntry
    >(props, {
      data: { items: [] },
      config: { transform: ({ items }) => items },
    });

    return { entry, entryLoaded, clearError, form, routeLeave, submit, toForm };
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

      useStoreEntry().setEntry({ items });
    },
  },
});
</script>

<style lang="scss" scoped></style>
