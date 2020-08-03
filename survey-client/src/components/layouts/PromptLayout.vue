<template>
  <v-card>
    <slot name="header">
      <v-sheet class="pt-5 px-5">
        <h3>{{ localeText }}</h3>
        <p v-if="localeDescription" class="mb-0" v-html="localeDescription"></p>
      </v-sheet>
    </slot>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { LocaleTranslation } from '@common/types/common';

export default Vue.extend({
  name: 'PromptLayout',

  props: {
    text: {
      type: Object as () => LocaleTranslation<string>,
      required: true,
    },
    description: {
      type: Object as () => LocaleTranslation,
      default: null,
    },
  },

  computed: {
    localeText(): string {
      return this.text[this.$i18n.locale];
    },

    localeDescription(): string | null {
      return this.description[this.$i18n.locale];
    },
  },
});
</script>

<style lang="scss" scoped></style>
