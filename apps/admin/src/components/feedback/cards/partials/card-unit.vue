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
          :label="$t('feedback-schemes.cards.unit.name')"
          :rules="nameRules"
          hide-details="auto"
          outlined
        ></v-text-field>
      </template>
    </language-selector>
    <language-selector
      v-model="internalUnit.name"
      :label="$t('feedback-schemes.cards.unit.description').toString()"
    >
      <template v-for="lang in Object.keys(internalUnit.description)" #[`lang.${lang}`]>
        <editor :key="lang" v-model="internalUnit.description[lang]" :init="tinymceInit" />
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
import { LanguageSelector } from '@intake24/admin/components/forms';
import { tinymce } from '@intake24/admin/components/tinymce';
import { copy } from '@intake24/common/util';

export default defineComponent({
  name: 'CardUnit',

  components: { LanguageSelector },

  mixins: [tinymce],

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
