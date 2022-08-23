<template>
  <layout v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="save">
    <v-toolbar bottom color="grey lighten-5" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('languages.translations.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="translations.length">
        <confirm-dialog
          color="secondary"
          fab
          icon
          icon-left="fas fa-rotate"
          :label="$t('common.action.sync').toString()"
          @confirm="sync"
        >
          {{ $t('languages.translations.sync') }}
        </confirm-dialog>
        <confirm-dialog
          color="error"
          fab
          icon
          icon-left="$delete"
          :label="$t('common.action.delete').toString()"
          @confirm="remove"
        >
          {{ $t('languages.translations.delete') }}
        </confirm-dialog>
      </template>
    </v-toolbar>
    <v-list v-if="translations.length" two-line>
      <v-list-item
        v-for="translation in translations"
        :key="translation.id"
        class="list-item-border"
        link
      >
        <v-list-item-avatar>
          <v-icon>fa-language</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ $t(`languages.translations.applications.${translation.application}`) }} |
            {{ getSectionTitle(translation.section) }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon :title="$t('languages.translations.edit')" @click.stop="edit(translation)">
            <v-icon color="primary lighten-2">$edit</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-card v-else flat link min-height="100px" @click="create">
      <v-card-title class="d-flex justify-center font-weight-medium">
        {{ $t('languages.translations.create') }}
      </v-card-title>
      <v-card-text class="d-flex justify-center align-center">
        <v-btn color="primary" fab x-large>
          <v-icon>$add</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
    <translation-section
      :translation="selected ?? undefined"
      @close="close"
      @update="update"
    ></translation-section>
  </layout>
</template>

<script lang="ts">
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type {
  LanguageEntry,
  LanguageTranslationsResponse,
} from '@intake24/common/types/http/admin';
import type { LanguageTranslationAttributes } from '@intake24/common/types/models';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import watchEntry from '@intake24/admin/components/entry/watch-entry';
import { copy } from '@intake24/common/util';
import { ConfirmDialog } from '@intake24/ui';

import TranslationSection from './translation-section.vue';

export default defineComponent({
  name: 'LanguageTranslations',

  components: { ConfirmDialog, TranslationSection },

  mixins: [detailMixin, watchEntry],

  provide: () => ({
    editsResource: true,
  }),

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<LanguageEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      translations: [] as LanguageTranslationsResponse,
      selected: null as LanguageTranslationAttributes | null,
    };
  },

  computed: {
    entryChanged(): boolean {
      return !isEqual(this.originalEntry, this.translations);
    },
  },

  async mounted() {
    const { data } = await this.$http.get<LanguageTranslationsResponse>(
      `admin/languages/${this.id}/translations`
    );

    this.translations = data;
    this.setOriginalEntry(data);
  },

  methods: {
    getSectionTitle(key: string): string {
      const check = has(this.$i18n.messages[this.$i18n.locale], `${key}.title`);
      if (check) return this.$t(`${key}.title`).toString();

      return this.$t(`languages.translations.sections.${key}`).toString();
    },

    edit(translation: LanguageTranslationAttributes) {
      this.selected = translation;
    },

    update(translation: LanguageTranslationAttributes) {
      const match = this.translations.find((item) => item.id === translation.id);

      if (match) match.messages = copy(translation.messages);
    },

    close() {
      this.selected = null;
    },

    async create() {
      const { data } = await this.$http.post<LanguageTranslationsResponse>(
        `admin/languages/${this.id}/translations`,
        {},
        { withLoading: true }
      );

      this.translations = data;
      this.setOriginalEntry(data);
    },

    async save() {
      const { translations } = this;

      const { data } = await this.$http.put<LanguageTranslationsResponse>(
        `admin/languages/${this.id}/translations`,
        { translations },
        { withLoading: true }
      );

      this.translations = data;
      this.setOriginalEntry(data);
    },

    async remove() {
      await this.$http.delete(`admin/languages/${this.id}/translations`, { withLoading: true });
      this.translations = [];
      this.setOriginalEntry([]);
    },

    async sync() {
      const { data } = await this.$http.post<LanguageTranslationsResponse>(
        `admin/languages/${this.id}/translations/sync`,
        {},
        { withLoading: true }
      );
      this.translations = data;
      this.setOriginalEntry(data);
    },
  },
});
</script>

<style lang="scss" scoped></style>
