<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>Leftovers</template>
      <v-row>
        <v-col>
          <v-card>Leftover content here</v-card>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { GuideImagePromptProps } from '@common/types';
import { guideImagePromptDefaultProps } from '@common/defaults';
import localeContent from '@/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'GuideImagePrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => GuideImagePromptProps,
    },
  },

  data() {
    return {
      ...merge(guideImagePromptDefaultProps, this.props),
      errors: [] as string[],
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },
});
</script>

<style lang="scss" scoped></style>
