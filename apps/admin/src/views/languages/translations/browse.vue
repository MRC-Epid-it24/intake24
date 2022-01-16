<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" @save="submit">
    <v-toolbar flat tile color="grey lighten-5" bottom>
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`languages.translations.title`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-list two-line>
      <v-list-item
        v-for="translation in translations"
        :key="translation.id"
        class="list-item-border"
        link
      >
        <v-list-item-avatar>
          <v-icon>fa-grip-vertical</v-icon>
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
    <translation-section
      :translation="selected"
      @close="close"
      @update="update"
    ></translation-section>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import { LanguageEntry, LanguageTranslationsResponse } from '@intake24/common/types/http/admin';
import { LanguageTranslationAttributes } from '@intake24/common/types/models';
import { copy } from '@intake24/common/util';
import { DetailMixin } from '@intake24/admin/types';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
import watchEntry from '@intake24/admin/components/entry/watch-entry';
import TranslationSection from './translation-section.vue';

type Mixins = InstanceType<typeof watchEntry>;

export default (Vue as VueConstructor<Vue & DetailMixin<LanguageEntry> & Mixins>).extend({
  name: 'LanguageTranslations',

  provide: () => ({
    editsResource: true,
  }),

  components: { TranslationSection },

  mixins: [detailMixin, watchEntry],

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

    async submit() {
      const { translations } = this;

      const { data } = await this.$http.post(`admin/languages/${this.id}/translations`, {
        translations,
      });

      this.translations = data;
      this.setOriginalEntry(data);
    },
  },
});
</script>

<style lang="scss" scoped></style>
