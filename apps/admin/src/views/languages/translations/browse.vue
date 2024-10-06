<template>
  <layout v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="save">
    <v-toolbar color="grey-lighten-4" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('languages.translations.title') }}
      </v-toolbar-title>
      <v-spacer />
      <template v-if="form.translations.length">
        <confirm-dialog
          color="primary"
          icon
          icon-left="fas fa-rotate"
          :label="$t('common.action.sync')"
          size="small"
          @confirm="sync"
        >
          {{ $t('languages.translations.sync') }}
        </confirm-dialog>
        <confirm-dialog
          class="ms-2"
          color="error"
          icon
          icon-left="$delete"
          :label="$t('common.action.delete')"
          size="small"
          @confirm="remove"
        >
          {{ $t('languages.translations.delete') }}
        </confirm-dialog>
      </template>
    </v-toolbar>
    <error-list :errors="nonInputErrors" tag="v-card-text" />
    <v-list v-if="form.translations.length" class="list-border" lines="two">
      <v-list-item
        v-for="translation in form.translations"
        :key="translation.id"
        link
      >
        <template #prepend>
          <v-icon>fas fa-language</v-icon>
        </template>
        <v-list-item-title>
          {{ $t(`languages.translations.applications.${translation.application}`) }} |
          {{ getSectionTitle(translation.section) }}
        </v-list-item-title>
        <template #append>
          <v-list-item-action>
            <v-btn icon="$edit" :title="$t('languages.translations.edit')" @click.stop="edit(translation)" />
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
    <v-card v-else flat link min-height="100px" @click="create">
      <v-card-title class="d-flex justify-center font-weight-medium">
        {{ $t('languages.translations.create') }}
      </v-card-title>
      <v-card-text class="d-flex justify-center align-center">
        <v-btn color="secondary" icon="$add" size="x-large" />
      </v-card-text>
    </v-card>
    <translation-section
      :translation="selected ?? undefined"
      @close="close"
      @update="update"
    />
  </layout>
</template>

<script lang="ts">
import has from 'lodash/has';
import { defineComponent } from 'vue';

import type {
  LanguageEntry,
  LanguageTranslationsResponse,
} from '@intake24/common/types/http/admin';
import type { LanguageTranslationAttributes } from '@intake24/db';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui';
import { useMessages } from '@intake24/ui/stores';

import TranslationSection from './translation-section.vue';

export type LanguageTranslationsForm = { translations: LanguageTranslationsResponse };

export default defineComponent({
  name: 'LanguageTranslations',

  components: { ConfirmDialog, TranslationSection },

  mixins: [formMixin],

  setup(props) {
    const { i18n } = useI18n();

    const messages = useMessages();
    const { entry, entryLoaded } = useEntry<LanguageEntry>(props);
    useEntryFetch(props);
    const { form, nonInputErrors, routeLeave, toForm } = useEntryForm<
      LanguageTranslationsForm,
      LanguageEntry
    >(props, {
      data: { translations: [] },
      nonInputErrorKeys: ['translations'],
    });

    function getSectionTitle(key: string) {
      const check = has(i18n.messages.value[i18n.locale.value], `${key}.title`);
      if (check)
        return i18n.t(`${key}.title`);

      return i18n.t(`languages.translations.sections.${key}`);
    };

    return {
      entry,
      entryLoaded,
      form,
      nonInputErrors,
      routeLeave,
      toForm,
      messages,
      getSectionTitle,
    };
  },

  data() {
    return {
      selected: null as LanguageTranslationAttributes | null,
    };
  },

  async mounted() {
    const { data: translations } = await this.$http.get<LanguageTranslationsResponse>(
      `admin/languages/${this.id}/translations`,
    );

    this.toForm({ translations });
  },

  methods: {
    edit(translation: LanguageTranslationAttributes) {
      this.selected = translation;
    },

    update(translation: LanguageTranslationAttributes) {
      const match = this.form.translations.find(item => item.id === translation.id);

      if (match)
        match.messages = copy(translation.messages);
    },

    close() {
      this.selected = null;
    },

    notify(action: string) {
      this.messages.success(
        this.$t(`languages.translations.${action}`, { name: this.entry.englishName }),
      );
    },

    async create() {
      const { data: translations } = await this.$http.post<LanguageTranslationsResponse>(
        `admin/languages/${this.id}/translations`,
        {},
        { withLoading: true },
      );

      this.toForm({ translations });
      this.notify('created');
    },

    async save() {
      const translations = await this.form.put<LanguageTranslationsResponse>(
        `admin/languages/${this.id}/translations`,
      );

      this.toForm({ translations });
      this.notify('updated');
    },

    async remove() {
      await this.$http.delete(`admin/languages/${this.id}/translations`, { withLoading: true });
      this.toForm({ translations: [] });

      this.notify('deleted');
    },

    async sync() {
      const { data: translations } = await this.$http.post<LanguageTranslationsResponse>(
        `admin/languages/${this.id}/translations/sync`,
        {},
        { withLoading: true },
      );

      this.toForm({ translations });
      this.notify('synced');
    },
  },
});
</script>

<style lang="scss" scoped></style>
