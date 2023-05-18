<template>
  <v-tab-item key="content">
    <v-tabs vertical>
      <v-tab v-for="(item, key) in items" :key="key">
        <v-icon left>fas fa-location-arrow</v-icon>{{ key }}
      </v-tab>
      <v-tab-item v-for="(item, key) in items" :key="key" class="pl-3">
        <language-selector v-model="items[key]" :label="getKeyTranslation(key)" @input="update">
          <template v-for="lang in Object.keys(items[key])" #[`lang.${lang}`]>
            <v-text-field
              v-if="plainTextOnly.includes(key.toString())"
              :key="lang"
              v-model="items[key][lang]"
              hide-details="auto"
              :label="getKeyTranslation(key)"
              outlined
              @input="update"
            ></v-text-field>
            <html-editor
              v-else
              :key="lang"
              v-model="items[key][lang]"
              @input="update"
            ></html-editor>
          </template>
        </language-selector>
      </v-tab-item>
    </v-tabs>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import has from 'lodash/has';
import { defineComponent, ref, watch } from 'vue';

import type { BasePrompt } from '@intake24/common/prompts';
import { HtmlEditor } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { useI18n } from '@intake24/admin/i18n';
import { capitalize, copy } from '@intake24/common/util';

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

  emits: ['update:i18n'],

  setup(props, { emit }) {
    const i18n = useI18n();

    const items = ref(copy(props.i18n));
    const plainTextOnly = ['name', 'text', 'label'];

    const getKeyTranslation = (key: string | number) => {
      if (typeof key === 'number') return key.toString();

      const check = has(i18n.messages[i18n.locale], `survey-schemes.questions.${key}._`);

      return check ? i18n.t(`survey-schemes.questions.${key}._`).toString() : capitalize(key);
    };

    const update = () => {
      emit('update:i18n', items.value);
    };

    watch(
      () => props.i18n,
      (val) => {
        if (deepEqual(val, items.value)) return;

        items.value = copy(val);
      }
    );

    return {
      items,
      plainTextOnly,
      getKeyTranslation,
      update,
    };
  },
});
</script>

<style lang="scss" scoped></style>
