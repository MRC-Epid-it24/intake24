<template>
  <v-tabs-window-item key="json" value="json">
    <json-editor v-bind="{ modelValue }" @update:model-value="$emit('update:modelValue', $event)" />
  </v-tabs-window-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import { JsonEditor } from '@intake24/admin/components/editors';

export default defineComponent({
  name: 'PromptJson',

  components: { JsonEditor },

  props: {
    modelValue: {
      type: Object as PropType<Prompt>,
      required: true,
    },
  },

  emits: ['update:modelValue'],
});
</script>

<style lang="scss" scoped></style>
