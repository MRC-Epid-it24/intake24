<template>
  <component :is="promptComponent" v-bind="{ promptProps }" @continue="onAnswer"></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import NoMoreInformationPrompt from '@intake24/survey/components/prompts/standard/NoMoreInformationPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'NoMoreInformationPromptHandler',

  components: { NoMoreInformationPrompt },

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

  computed: {
    ...mapState(useSurvey, ['selection']),
  },

  methods: {
    ...mapActions(useSurvey, ['setSelection']),

    onAnswer() {
      this.$emit('continue');
    },

    commitAnswer() {
      if (this.selection !== undefined) {
        const newSelection = this.selection;
        newSelection.mode = 'auto';
        this.setSelection(newSelection);
      }
    },
  },
});
</script>

<style scoped></style>
