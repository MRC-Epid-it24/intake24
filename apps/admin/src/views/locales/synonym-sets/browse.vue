<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="save">
    <v-toolbar color="grey-lighten-4" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('locales.synonym-sets.title') }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        color="primary"
        icon="$add"
        size="small"
        :title="$t('locales.synonym-sets.add')"
        @click.stop="add"
      />
    </v-toolbar>
    <v-list class="list-border">
      <v-list-item v-for="(item, idx) in form.items" :key="idx">
        <template #prepend>
          <v-icon>fas fa-arrows-split-up-and-left</v-icon>
        </template>
        <v-text-field
          v-model.trim="item.synonyms"
          class="my-1"
          density="compact"
          hide-details="auto"
          :label="$t('locales.synonym-sets.synonyms')"
          name="synonyms"
          variant="outlined"
        />
        <template #append>
          <v-list-item-action>
            <confirm-dialog
              color="error"
              icon
              icon-left="$delete"
              :label="$t('locales.synonym-sets.remove')"
              @confirm="remove(idx)"
            >
              {{ $t('common.action.confirm.delete', { name: item.synonyms }) }}
            </confirm-dialog>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type {
  LocaleEntry,
  SynonymSetAttributes,
  SynonymSetRequest,
} from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { useEntry as useStoreEntry } from '@intake24/admin/stores';
import { ConfirmDialog } from '@intake24/ui';

export type SynonymSetsForm = { items: SynonymSetRequest[] };

export default defineComponent({
  name: 'SynonymSets',

  components: { ConfirmDialog },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<LocaleEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit, toForm } = useEntryForm<
      SynonymSetsForm,
      LocaleEntry
    >(props, {
      data: { items: [] },
      config: { transform: ({ items }) => items },
    });

    return { entry, entryLoaded, clearError, form, routeLeave, submit, toForm };
  },

  async mounted() {
    const { data: items } = await this.$http.get<SynonymSetAttributes[]>(
      `admin/locales/${this.id}/synonym-sets`,
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

      const items = await this.form.post<SynonymSetAttributes[]>(
        `admin/locales/${this.id}/synonym-sets`,
      );

      useStoreEntry().setEntry({ items });
    },
  },
});
</script>

<style lang="scss" scoped></style>
