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
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { merge } from '@intake24/common/util';
import type { BasePromptProps } from '@intake24/common/prompts';
import { basePromptProps } from '@intake24/common/prompts';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import BasePortion from './BasePortion';

export default defineComponent({
  name: 'AsServedLeftoverPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(basePromptProps, this.promptProps),
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
