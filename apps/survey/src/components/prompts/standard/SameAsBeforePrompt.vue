<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <!-- <v-card class="mb-4" flat outlined tile>
    </v-card> -->
    <template #actions>
      <v-btn
        :block="isMobile"
        class="px-4"
        color="secondary"
        large
        text
        @click.stop="action('notSame')"
      >
        {{ $t(`prompts.${type}.notSame`) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-4"
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        color="secondary"
        large
        text
        @click.stop="action('same')"
      >
        {{ $t(`prompts.${type}.same`) }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn value="notSame" @click.stop="action('notSame')">
        <span class="text-overline font-weight-medium">
          {{ $t(`prompts.${type}.notSame`) }}
        </span>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn value="same" @click.stop="action('same')">
        <span class="text-overline font-weight-medium">
          {{ $t(`prompts.${type}.same`) }}
        </span>
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { SameAsBeforeItem } from '@intake24/survey/stores';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'SameAsBeforePrompt',

  mixins: [createBasePrompt<'same-as-before-prompt'>()],

  props: {
    sabFood: {
      type: Object as PropType<SameAsBeforeItem>,
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
