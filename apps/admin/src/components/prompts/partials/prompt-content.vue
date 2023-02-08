<template>
  <v-tab-item key="content">
    <v-tabs vertical>
      <v-tab v-for="(item, key) in items" :key="key">
        <v-icon left>fas fa-location-arrow</v-icon>{{ key }}
      </v-tab>
      <v-tab-item v-for="(item, key) in items" :key="key" class="pl-3">
        <language-selector
          v-model="items[key]"
          :label="$t('survey-schemes.questions.name._').toString()"
          @input="update"
        >
          <template v-for="lang in Object.keys(items[key])" #[`lang.${lang}`]>
            <v-text-field
              v-if="['name', 'text'].includes(key.toString())"
              :key="lang"
              v-model="items[key][lang]"
              hide-details="auto"
              :label="$t('survey-schemes.questions.name._')"
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
import { defineComponent } from 'vue';

import type { BasePrompt } from '@intake24/common/prompts';
import { HtmlEditor } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { copy } from '@intake24/common/util';

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

  data() {
    return {
      items: copy(this.i18n),
    };
  },

  /* computed: {
    nameRules(): RuleCallback[] {
      if (!this.nameRequired) return [];

      return [this.valueRequiredCallBack('name')];
    },
    textRules(): RuleCallback[] {
      if (!this.textRequired) return [];

      return [this.valueRequiredCallBack('text')];
    },
    descriptionRules(): RuleCallback[] {
      if (!this.descriptionRequired) return [];

      return [this.valueRequiredCallBack('description')];
    },
  }, */

  watch: {
    i18n(val) {
      if (deepEqual(val, this.items)) return;

      this.items = copy(val);
    },
  },

  methods: {
    /* valueRequiredCallBack(field: 'name' | 'text' | 'description') {
      return (value: string | null): boolean | string =>
        !!value || this.$t(`survey-schemes.questions.${field}.required`).toString();
    }, */

    update() {
      this.$emit('update:i18n', this.items);
    },
  },
});
</script>

<style lang="scss" scoped></style>
