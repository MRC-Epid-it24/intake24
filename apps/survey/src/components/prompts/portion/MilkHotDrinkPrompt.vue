<template>
  <v-container>
    <portion-layout :description="description" :text="text">
      <template #headerText>
        {{ $t('portion.milkHotDrink.label') }} - {{ localeDescription }}
      </template>
      <v-row>
        <v-col>
          <v-card>Milk Hot Drink content here</v-card>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MilkHotDrinkPromptProps } from '@intake24/common/prompts';
import { milkHotDrinkPromptDefaultProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { localeContent } from '@intake24/survey/components/mixins';

import BasePortion from './BasePortion';

export default defineComponent({
  name: 'MilkHotDrinkPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<MilkHotDrinkPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(milkHotDrinkPromptDefaultProps, this.promptProps),
      errors: [] as string[],
    };
  },

  computed: {
    localeDescription(): string {
      return this.getLocaleContent(this.description);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },
});
</script>

<style lang="scss" scoped></style>
