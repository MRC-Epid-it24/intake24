<template>
  <prompt-layout v-bind="{ description, text, meal }">
    <template #actions>
      <v-btn
        :block="isMobile"
        class="px-10 ml-0"
        color="error"
        :title="$t('common.action.no')"
        x-large
        @click.stop="update(false)"
      >
        <v-icon left>far fa-times-circle</v-icon>
        {{ $t('common.action.no') }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-10"
        :class="{ 'ml-0': isMobile, 'mb-2': isMobile }"
        color="success"
        :title="$t('common.action.yes')"
        x-large
        @click.stop="update(true)"
      >
        <v-icon left>far fa-circle-check</v-icon>
        {{ $t('common.action.yes') }}
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { YesNoPromptProps } from '@intake24/common/prompts';
import { yesNoPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'YesNoPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<YesNoPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(yesNoPromptProps, this.promptProps),
    };
  },

  methods: {
    update(value: boolean) {
      this.$emit('update', { state: value, valid: true });
      this.$emit('continue');
    },
  },
});
</script>

<style lang="scss" scoped></style>
