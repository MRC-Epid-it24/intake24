<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.cereal.label') }} - {{ localDescription }}
      </template>
      <v-row>
        <v-col>
          <v-card>Cereal Prompt content here</v-card>
          <!-- Select bowl -->

          <!-- Portion size -->

          <!-- Leftovers -->

          
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { CerealPromptProps, cerealPromptDefaultProps } from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'CerealPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => CerealPromptProps,
    },
  },

  data() {
    return {
      ...merge(cerealPromptDefaultProps, this.promptProps),
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
