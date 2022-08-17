<template>
  <component :is="promptComponent" v-bind="{ promptProps }" @restart="restart"></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import FinalPrompt from '@intake24/survey/components/prompts/standard/FinalPrompt.vue';
// import RedirectPrompt from '@intake24/survey/components/prompts/standard/RedirectPrompt.vue';

export default defineComponent({
  name: 'FinalPromptHandler',

  components: { FinalPrompt /*, RedirectPrompt */ },

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
  },

  methods: {
    async restart() {
      this.$emit('restart');
    },
  },
});
</script>

<style scoped></style>
