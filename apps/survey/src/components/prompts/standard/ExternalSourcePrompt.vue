<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <component :is="prompt.source.type" v-bind="{ food, prompt, value }" @input="select" />
    <template #actions>
      <v-btn
        class="px-4"
        color="primary"
        large
        outlined
        :title="promptI18n.missing"
        @click="action('missing')"
      >
        <v-icon left>
          $no
        </v-icon>
        {{ promptI18n.missing }}
      </v-btn>
      <v-spacer />
      <next v-if="value.data" :disabled="!isValid" :label="promptI18n.select" @click="action('next')" />
    </template>
    <template #nav-actions>
      <v-btn color="primary" text :title="promptI18n.missing" @click="action('missing')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.missing }}
        </span>
        <v-icon class="pb-1">
          $no
        </v-icon>
      </v-btn>
      <next-mobile v-if="value.data" :disabled="!isValid" :label="promptI18n.select" @click="action('next')" />
    </template>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { FoodState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';
import externalSources from './external-sources';

export default defineComponent({
  name: 'ExternalSourcePrompt',

  components: { ...externalSources },

  mixins: [createBasePrompt<'external-source-prompt', FoodState>()],

  props: {
    food: {
      type: Object as PropType<FoodState>,
      required: true,
    },
    value: {
      type: Object as PropType<PromptStates['external-source-prompt']>,
      required: true,
    },
  },

  setup(props, ctx) {
    const { translate } = useI18n();
    const { action, translatePrompt } = usePromptUtils(props, ctx);

    const isValid = computed(() => !!props.value);

    const promptI18n = computed(() => translatePrompt(['select', 'missing']),
    );

    const select = (data: PromptStates['external-source-prompt']) => {
      ctx.emit('input', data);
    };

    return {
      action,
      isValid,
      promptI18n,
      select,
      translate,
    };
  },
});
</script>

<style lang="scss" scoped></style>
