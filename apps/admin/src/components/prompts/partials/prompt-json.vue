<template>
  <v-tabs-window-item key="json" value="json">
    <json-editor v-bind="{ modelValue }" @update:model-value="$emit('update:modelValue', $event)" />
  </v-tabs-window-item>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

import { JsonEditor } from '@intake24/admin/components/editors';
import type { Prompt } from '@intake24/common/prompts';

defineOptions({ name: 'PromptJson' });

defineProps({
  modelValue: {
    type: Object as PropType<Prompt>,
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped></style>
