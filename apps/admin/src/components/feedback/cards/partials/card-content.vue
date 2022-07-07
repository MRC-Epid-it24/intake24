<template>
  <v-tab-item key="content">
    <language-selector
      :label="$t('feedback-schemes.cards.name')"
      :value="name"
      @input="update('name', $event)"
    >
      <template v-for="lang in Object.keys(name)" v-slot:[`lang.${lang}`]>
        <v-text-field
          :key="lang"
          :label="$t('feedback-schemes.cards.name')"
          :rules="nameRules"
          :value="name[lang]"
          hide-details="auto"
          outlined
          @input="updateLanguage('name', lang, $event)"
        ></v-text-field>
      </template>
    </language-selector>
    <language-selector
      :label="$t('feedback-schemes.cards.description')"
      :value="description"
      @input="update('description', $event)"
    >
      <template v-for="lang in Object.keys(description)" v-slot:[`lang.${lang}`]>
        <editor
          :init="tinymceInit"
          :key="lang"
          :value="description[lang]"
          @input="updateLanguage('description', lang, $event)"
        />
      </template>
    </language-selector>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { tinymce } from '@intake24/admin/components/tinymce';
import { LanguageSelector } from '@intake24/admin/components/forms';
import type { RuleCallback } from '@intake24/admin/types';
import type { CustomCard } from '@intake24/common/feedback';

export type LocaleTranslationKeys = 'name' | 'description';

export default defineComponent({
  name: 'CardContent',

  components: { LanguageSelector },

  mixins: [tinymce],

  props: {
    name: {
      type: Object as PropType<CustomCard['name']>,
      required: true,
    },
    nameRequired: {
      type: Boolean,
      default: true,
    },
    description: {
      type: Object as PropType<CustomCard['description']>,
      required: true,
    },
  },

  computed: {
    nameRules(): RuleCallback[] {
      return this.nameRequired
        ? [
            (value: string | null): boolean | string =>
              !!value || this.$t('feedback-schemes.cards.required').toString(),
          ]
        : [];
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
    updateLanguage(field: LocaleTranslationKeys, locale: string, value: any) {
      this.$emit(`update:${field}`, { ...this.$props[field], [locale]: value });
    },
  },
});
</script>

<style lang="scss" scoped></style>
