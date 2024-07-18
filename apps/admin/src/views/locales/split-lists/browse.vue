<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="save">
    <v-toolbar bottom color="grey lighten-5" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('locales.split-lists.title') }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        class="ml-3"
        color="primary"
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
                hide-details="auto"
                :label="$t('locales.split-lists.firstWord')"
                name="firstWord"
                outlined
              />
            </v-col>
            <v-col cols="12" md>
              <v-text-field
                v-model.trim="item.words"
                hide-details="auto"
                :label="$t('locales.split-lists.words')"
                name="words"
                outlined
              />
            </v-col>
          </v-row>
        </v-list-item-content>
        <v-list-item-action>
          <confirm-dialog
            color="error"
            icon
            icon-left="$delete"
            :label="$t('locales.split-lists.remove').toString()"
            @confirm="remove(idx)"
          >
            {{ $t('common.action.confirm.delete', { name: item.firstWord }) }}
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
  SplitListAttributes,
  SplitListRequest,
} from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { useEntry as useStoreEntry } from '@intake24/admin/stores';
import { ConfirmDialog } from '@intake24/ui';

export type SplitListsForm = { items: SplitListRequest[] };

export default defineComponent({
  name: 'SplitLists',

  components: { ConfirmDialog },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<LocaleEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit, toForm } = useEntryForm<
      SplitListsForm,
      LocaleEntry
    >(props, {
      data: { items: [] },
      config: { transform: ({ items }) => items },
    });

    return { entry, entryLoaded, clearError, form, routeLeave, submit, toForm };
  },

  async mounted() {
    const { data: items } = await this.$http.get<SplitListAttributes[]>(
      `admin/locales/${this.id}/split-lists`,
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

      const items = await this.form.post<SplitListAttributes[]>(`admin/locales/${this.id}/split-lists`);

      useStoreEntry().setEntry({ items });
    },
  },
});
</script>

<style lang="scss" scoped></style>
