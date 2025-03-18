<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text>
      <v-card class="mb-4" color="info" flat rounded="lg" tile variant="tonal">
        <v-card-title>
          {{ promptI18n.split }}
        </v-card-title>
        <v-card-text class="d-flex flex-column align-start gr-2">
          <v-chip v-for="(suggestion) in suggestions" :key="suggestion" class="px-4" color="info" variant="flat">
            <v-icon class="mr-2" icon="$food" />
            {{ suggestion }}
          </v-chip>
        </v-card-text>
      </v-card>
    </v-card-text>
    <template #actions>
      <v-btn
        class="px-4"
        color="primary"
        size="large"
        :title="promptI18n.separate"
        variant="flat"
        @click.stop="action('separate')"
      >
        {{ promptI18n.separate }}
      </v-btn>
      <v-btn
        class="px-4"
        color="primary"
        size="large"
        :title="promptI18n.single"
        variant="text"
        @click.stop="action('single')"
      >
        {{ promptI18n.single }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn color="primary" :title="promptI18n.separate" variant="flat" @click.stop="action('separate')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.separate }}
        </span>
      </v-btn>
      <v-divider vertical />
      <v-btn color="primary" :title="promptI18n.single" variant="text" @click.stop="action('single')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.single }}
        </span>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import type { FreeTextFood } from '@intake24/common/surveys';
import { usePromptUtils } from '@intake24/survey/composables';
import { CardLayout } from '../layouts';
import { createBasePromptProps } from '../prompt-props';

const props = defineProps({
  ...createBasePromptProps<'split-food-prompt', FreeTextFood>(),
  food: {
    type: Object as PropType<FreeTextFood>,
    required: true,
  },
  suggestions: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { action, translatePrompt } = usePromptUtils(props, { emit });

const isValid = true;
const promptI18n = computed(() =>
  translatePrompt([
    'split',
    'separate',
    'single',
  ]),
);
</script>

<style lang="scss" scoped></style>
