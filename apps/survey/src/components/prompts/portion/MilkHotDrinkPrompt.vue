<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.milkHotDrink.label') }} - {{ localDescription }}
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
import Vue, { VueConstructor } from 'vue';
import { merge } from '@intake24/common/util';
import { MilkHotDrinkPromptProps, milkHotDrinkPromptDefaultProps } from '@intake24/common/prompts';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'MilkHotDrinkPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => MilkHotDrinkPromptProps,
    },
  },

  data() {
    return {
      ...merge(milkHotDrinkPromptDefaultProps, this.promptProps),
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
