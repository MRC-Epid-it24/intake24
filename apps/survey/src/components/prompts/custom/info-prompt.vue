<template>
  <prompt-layout v-bind="{ description, text, meal, food, isValid }" @nav-action="navAction">
    <template #actions>
      <continue @click.native="navAction('next')"></continue>
    </template>
    <!-- <template #nav-actions>
      <v-spacer></v-spacer>
      <v-btn :color="isValid ? 'success' : 'primary'" dark :disabled="!isValid" value="next">
        <span class="text-overline font-weight-medium">{{ $t('common.action.continue') }}</span>
        <v-icon>$next</v-icon>
      </v-btn>
    </template> -->
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { InfoPromptProps } from '@intake24/common/prompts';
import { infoPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'InfoPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<InfoPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(infoPromptProps, this.promptProps),
      currentValue: 'ok',
    };
  },

  computed: {
    isValid(): boolean {
      return true;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: this.currentValue, valid: this.isValid });
    },

    confirm() {
      this.update();
      return true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
