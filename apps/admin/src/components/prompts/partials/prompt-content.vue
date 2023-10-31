<template>
  <v-tab-item key="content" value="content">
    <v-tabs vertical>
      <v-tab v-for="key in keys" :key="key" class="justify-start">
        <v-icon left>$languages</v-icon>{{ key }}
      </v-tab>
      <v-tab-item v-for="key in keys" :key="key" class="pl-3">
        <v-card outlined>
          <v-toolbar color="grey lighten-4" flat>
            <v-toolbar-title>
              <i18n path="survey-schemes.i18n.core">
                <template #key>
                  <span class="font-weight-medium">{{ key }}</span>
                </template>
              </i18n>
            </v-toolbar-title>
          </v-toolbar>
          <v-alert
            v-for="lang in getAvailableLanguages(key, items)"
            :key="lang"
            class="mb-0"
            text
            tile
            type="info"
          >
            <template #prepend>
              <span :class="`fi fi-${lang} mr-3`"></span>
            </template>
            <template #default>
              <template v-if="$t(`prompts.${promptType}.${key}`, lang)">
                <div
                  v-if="key.includes('description')"
                  v-html="$t(`prompts.${promptType}.${key}`, lang)"
                ></div>
                <div v-else>{{ $t(`prompts.${promptType}.${key}`, lang) }}</div>
              </template>
              <div v-else>
                {{ $t('survey-schemes.i18n.none') }}
              </div>
            </template>
          </v-alert>
          <template v-if="items[key]">
            <language-selector
              v-if="items[key]"
              v-model="items[key]"
              flat
              :label="$t(`survey-schemes.i18n.custom`, { key }).toString()"
              :outlined="false"
              tile
              @lang-add="loadLanguage"
              @lang-remove="removeKey(key)"
            >
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
                  :label="$t(`survey-schemes.i18n.custom`, { key }).toString()"
                  outlined
                ></v-text-field>
              </template>
            </language-selector>
          </template>
          <v-card v-else flat link min-height="100px" @click="addKey(key)">
            <v-card-title class="d-flex justify-center font-weight-medium">
              {{ $t('survey-schemes.i18n.init') }}
            </v-card-title>
            <v-card-text class="d-flex justify-center align-center">
              <v-btn color="secondary" fab x-large>
                <v-icon>$add</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { useVModel } from '@vueuse/core';
import get from 'lodash/get';
import { computed, defineComponent } from 'vue';

import type { BasePrompt, ComponentType } from '@intake24/common/prompts';
import { HtmlEditor } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { getObjectNestedKeys } from '@intake24/common/util';
import { loadAdminLanguage, useI18n } from '@intake24/i18n';
import { promptType as getPromptType } from '@intake24/ui';

export default defineComponent({
  name: 'PromptContent',

  components: { HtmlEditor, LanguageSelector },

  props: {
    component: {
      type: String as PropType<ComponentType>,
      required: true,
    },
    i18n: {
      type: Object as PropType<BasePrompt['i18n']>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { i18n } = useI18n();
    const items = useVModel(props, 'i18n', emit);

    const richTextOnly = ['description'];

    const promptType = computed(() => getPromptType(props.component));

    const keys = computed(() =>
      getObjectNestedKeys(get(i18n.messages.en, `prompts.${promptType.value}`) as object)
    );

    const loadLanguage = async (code: string) => {
      await loadAdminLanguage(code);
    };

    const addKey = async (key: string) => {
      items.value = { ...items.value, [key]: {} };
    };

    const removeKey = (key: string) => {
      if (Object.keys(items.value[key]).length) return;

      delete items.value[key];
    };

    const getAvailableLanguages = (key: string, items: BasePrompt['i18n']) => {
      if (!items[key]) return ['en'];

      const langs = Object.keys(items[key]);
      return langs.length ? langs : ['en'];
    };

    return {
      addKey,
      getAvailableLanguages,
      items,
      keys,
      loadLanguage,
      promptType,
      removeKey,
      richTextOnly,
    };
  },
});
</script>

<style lang="scss" scoped></style>
