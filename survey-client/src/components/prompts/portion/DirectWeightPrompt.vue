<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>Direct Weight Prompt</template>
      <v-row>
        <v-col>
          <v-card>Direct Weight content here</v-card>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { DirectWeightPromptProps } from '@common/types';
import { directWeightPromptDefaultProps } from '@common/defaults';
import localeContent from '@/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'DirectWeightPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => DirectWeightPromptProps,
    },
  },

  data() {
    return {
      ...merge(directWeightPromptDefaultProps, this.props),
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
