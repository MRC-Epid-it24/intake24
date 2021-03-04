<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>Cereal Prompt</template>
      <v-row>
        <v-col>
          <v-card>Cereal Prompt content here</v-card>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { CerealPromptProps } from '@common/types';
import { cerealPromptDefaultProps } from '@common/defaults';
import localeContent from '@/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'CerealPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => CerealPromptProps,
    },
  },

  data() {
    return {
      ...merge(cerealPromptDefaultProps, this.props),
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
