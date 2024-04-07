<template>
  <v-tab-item key="json" value="json">
    <json-editor v-bind="{ value }" @input="$emit('input', $event)" />
  </v-tab-item>
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
    value: {
      type: Object as PropType<Prompt>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
