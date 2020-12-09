<template>
  <v-card :flat="isMobile" :tile="isMobile">
    <slot name="header">
      <v-sheet class="pt-5 px-5">
        <h3 class="my-3">{{ localeFoodName }}</h3>
        <p v-if="localeDescription" class="my-3" v-html="localeDescription"></p>
      </v-sheet>
    </slot>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { LocaleTranslation } from '@common/types/common';
import localeContent, { LocaleContent } from '@/components/mixins/localeContent';

export default (Vue as VueConstructor<Vue & LocaleContent>).extend({
  name: 'PortionLayout',

  mixins: [localeContent],

  props: {
    foodName: {
      type: Object as () => LocaleTranslation<string>,
      required: true,
    },
    description: {
      type: Object as () => LocaleTranslation,
      default: null,
    },
  },

  computed: {
    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
  },
});
</script>

<style lang="scss" scoped></style>
