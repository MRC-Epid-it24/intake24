<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <i18n class="text-subtitle-1" :path="`prompts.${type}.searchTerm`" tag="p">
        <template #food>
          <span class="font-weight-medium">{{ food.description }}</span>
        </template>
      </i18n>
      <v-card class="mb-4" flat outlined tile>
        <v-list color="grey lighten-5 py-0" subheader>
          <v-subheader>{{ promptI18n.split }}</v-subheader>
          <template v-for="(suggestion, idx) in suggestions">
            <v-list-item :key="suggestion" link>
              <v-list-item-icon>
                <v-icon>$food</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ suggestion }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="idx + 1 < suggestions.length" :key="`div-${suggestion}`" />
          </template>
        </v-list>
      </v-card>
      <p class="font-italic">
        {{ promptI18n.separateSuggestion }}
      </p>
      <p class="font-italic">
        {{ promptI18n.singleSuggestion }}
      </p>
    </v-card-text>
    <template #actions>
      <v-btn
        class="px-4"
        color="primary"
        large
        text
        :title="promptI18n.separate"
        @click.stop="action('separate')"
      >
        <v-icon left>
          fas fa-arrows-left-right-to-line
        </v-icon>
        {{ promptI18n.separate }}
      </v-btn>
      <v-btn
        class="px-4"
        color="primary"
        large
        text
        :title="promptI18n.single"
        @click.stop="action('single')"
      >
        <v-icon left>
          fas fa-arrow-up-long
        </v-icon>
        {{ promptI18n.single }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn color="primary" text :title="promptI18n.separate" @click.stop="action('separate')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.separate }}
        </span>
        <v-icon class="pb-1">
          fas fa-arrows-left-right-to-line
        </v-icon>
      </v-btn>
      <v-divider vertical />
      <v-btn color="primary" text :title="promptI18n.single" @click.stop="action('single')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.single }}
        </span>
        <v-icon class="pb-1">
          fas fa-arrow-up-long
        </v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { FreeTextFood } from '@intake24/common/types';
import { usePromptUtils } from '@intake24/survey/composables';

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

  setup(props, ctx) {
    const { action, translatePrompt, type } = usePromptUtils(props, ctx);

    const isValid = true;
    const promptI18n = computed(() =>
      translatePrompt([
        'searchTerm',
        'split',
        'singleSuggestion',
        'singleSuggestionEx',
        'separateSuggestion',
        'separateSuggestionEx',
        'separate',
        'single',
      ]),
    );

    return {
      action,
      isValid,
      promptI18n,
      type,
    };
  },
});
</script>

<style lang="scss" scoped></style>
