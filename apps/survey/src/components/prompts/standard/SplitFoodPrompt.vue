<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-card-text class="pt-2">
      <i18n class="text-subtitle-1" :path="`prompts.${type}.searchTerm`" tag="p">
        <template #food>
          <span class="font-weight-medium">{{ food.description }}</span>
        </template>
      </i18n>
      <v-card class="mb-4" flat outlined tile>
        <v-list color="grey lighten-5 py-0" subheader>
          <v-subheader>{{ $t(`prompts.${type}.split`) }}</v-subheader>
          <template v-for="(suggestion, idx) in suggestions">
            <v-list-item :key="suggestion" link>
              <v-list-item-icon>
                <v-icon>$food</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ suggestion }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="idx + 1 < suggestions.length" :key="`div-${suggestion}`"></v-divider>
          </template>
        </v-list>
      </v-card>
      <p class="font-italic">{{ $t(`prompts.${type}.separateSuggestion`) }}</p>
      <p class="font-italic">{{ $t(`prompts.${type}.singleSuggestion`) }}</p>
    </v-card-text>
    <template #actions>
      <v-btn
        :block="isMobile"
        class="px-4"
        color="secondary"
        large
        text
        @click.stop="action('separate')"
      >
        <v-icon left>fas fa-arrows-left-right-to-line</v-icon>
        {{ $t(`prompts.${type}.separate`) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-4"
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        color="secondary"
        large
        text
        @click.stop="action('single')"
      >
        <v-icon left>fas fa-arrow-up-long</v-icon>
        {{ $t(`prompts.${type}.single`) }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn value="separate" @click.stop="action('separate')">
        <span class="text-overline font-weight-medium">
          {{ $t(`prompts.${type}.separate`) }}
        </span>
        <v-icon class="pb-1">fas fa-arrows-left-right-to-line</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn value="single" @click.stop="action('single')">
        <span class="text-overline font-weight-medium">
          {{ $t(`prompts.${type}.single`) }}
        </span>
        <v-icon class="pb-1">fas fa-arrow-up-long</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FreeTextFood } from '@intake24/common/types';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'SplitFoodPrompt',

  mixins: [createBasePrompt<'split-food-prompt', FreeTextFood>()],

  props: {
    food: {
      type: Object as PropType<FreeTextFood>,
      required: true,
    },
    suggestions: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  computed: {
    isValid(): boolean {
      return true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
