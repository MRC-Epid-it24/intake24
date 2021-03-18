<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.asServedLeftover.label', { food: localeDescription }) }}
      </template>
      <v-card>
        <v-card-text>Full asServed method here using leftover image set</v-card-text>
      </v-card>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { AsServedLeftoverPromptProps, asServedLeftoverPromptDefaultProps } from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'AsServedLeftoverPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => AsServedLeftoverPromptProps,
    },
  },

  data() {
    return {
      ...merge(asServedLeftoverPromptDefaultProps, this.props),
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
