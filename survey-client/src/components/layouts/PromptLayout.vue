<template>
  <v-card :flat="isMobile" :tile="isMobile">
    <slot name="header">
      <v-sheet class="pt-5 px-5">
        <h3 class="mb-4">{{ localeText }}</h3>
        <div v-if="localeDescription" v-html="localeDescription"></div>
      </v-sheet>
    </slot>
    <v-card-text v-if="hasDefaultSlot">
      <slot></slot>
    </v-card-text>
    <v-card-actions
      v-if="hasActionsSlot"
      :class="{ 'flex-column-reverse': isMobile }"
      class="pa-4 d-flex"
    >
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { LocaleTranslation } from '@common/types';
import localeContent, { LocaleContent } from '@/components/mixins/localeContent';

export default (Vue as VueConstructor<Vue & LocaleContent>).extend({
  name: 'PromptLayout',

  mixins: [localeContent],

  props: {
    text: {
      type: [Object as () => LocaleTranslation<string>, String],
      required: true,
    },
    description: {
      type: [Object as () => LocaleTranslation, String],
      default: null,
    },
  },

  computed: {
    localeText(): string {
      const { text } = this;
      return typeof text === 'string' ? text : this.getLocaleContent(text);
    },

    localeDescription(): string | null {
      const { description } = this;
      return typeof description === 'string' ? description : this.getLocaleContent(description);
    },

    hasDefaultSlot(): boolean {
      return !!this.$slots.default;
    },

    hasActionsSlot(): boolean {
      return !!this.$slots.actions;
    },
  },
});
</script>

<style lang="scss" scoped></style>
