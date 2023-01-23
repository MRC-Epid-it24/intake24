<template>
  <v-tab-item key="unit">
    <language-selector
      v-model="internalUnit.name"
      :label="$t('feedback-schemes.cards.unit.name').toString()"
    >
      <template v-for="lang in Object.keys(internalUnit.name)" #[`lang.${lang}`]>
        <v-text-field
          :key="lang"
          v-model="internalUnit.name[lang]"
          hide-details="auto"
          :label="$t('feedback-schemes.cards.unit.name')"
          outlined
          :rules="nameRules"
        ></v-text-field>
      </template>
    </language-selector>
    <language-selector
      v-model="internalUnit.name"
      :label="$t('feedback-schemes.cards.unit.description').toString()"
    >
      <template v-for="lang in Object.keys(internalUnit.description)" #[`lang.${lang}`]>
        <html-editor :key="lang" v-model="internalUnit.description[lang]"></html-editor>
      </template>
    </language-selector>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { CustomCard } from '@intake24/common/feedback';
import { HtmlEditor } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { copy } from '@intake24/common/util';

export default defineComponent({
  name: 'CardUnit',

  components: { HtmlEditor, LanguageSelector },

  props: {
    unit: {
      type: Object as PropType<CustomCard['unit']>,
      required: true,
    },
    nameRequired: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['update:unit'],

  data() {
    return {
      internalUnit: copy(this.unit),
    };
  },

  computed: {
    nameRules(): RuleCallback[] {
      return this.nameRequired
        ? [
            (value: string | null): boolean | string =>
              !!value || this.$t('feedback-schemes.cards.unit.required').toString(),
          ]
        : [];
    },
  },

  watch: {
    unit(val: CustomCard['unit']) {
      if (isEqual(val, this.internalUnit)) return;

      this.internalUnit = copy(val);
    },
    internalUnit: {
      handler() {
        this.$emit('update:unit', this.internalUnit);
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
