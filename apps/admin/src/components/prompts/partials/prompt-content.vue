<template>
  <v-tab-item key="content">
    <v-tabs vertical>
      <v-tab v-for="(item, key) in items" :key="key">
        <v-icon left>fas fa-location-arrow</v-icon>{{ key }}
      </v-tab>
      <v-tab-item v-for="(item, key) in items" :key="key" class="pl-3">
        <language-selector v-model="items[key]" :label="getKeyTranslation(key)">
          <template v-for="lang in Object.keys(items[key])" #[`lang.${lang}`]>
            <html-editor
              v-if="richTextOnly.includes(key.toString())"
              :key="lang"
              v-model="items[key][lang]"
            ></html-editor>
            <v-text-field
              v-else
              :key="lang"
              v-model="items[key][lang]"
              hide-details="auto"
              :label="getKeyTranslation(key)"
              outlined
            ></v-text-field>
          </template>
        </language-selector>
      </v-tab-item>
    </v-tabs>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { useVModel } from '@vueuse/core';
import has from 'lodash/has';
import { defineComponent } from 'vue';

import type { BasePrompt } from '@intake24/common/prompts';
import { HtmlEditor } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { capitalize } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

/*
 * TODO
 * - it loads basic/common keys - name/text/description
 * - Add support to load other keys in i18n.prompts.[promptType].*
 */

export default defineComponent({
  name: 'PromptContent',

  components: { HtmlEditor, LanguageSelector },

  props: {
    i18n: {
      type: Object as PropType<BasePrompt['i18n']>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const i18n = useI18n();
    const items = useVModel(props, 'i18n', emit);

    const richTextOnly = ['description'];

    const getKeyTranslation = (key: string | number) => {
      if (typeof key === 'number') return key.toString();

      const check = has(i18n.messages[i18n.locale], `survey-schemes.questions.${key}._`);

      return check ? i18n.t(`survey-schemes.questions.${key}._`).toString() : capitalize(key);
    };

    return {
      items,
      richTextOnly,
      getKeyTranslation,
    };
  },
});
</script>

<style lang="scss" scoped></style>
