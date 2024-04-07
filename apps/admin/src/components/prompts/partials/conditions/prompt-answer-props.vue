<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        hide-details="auto"
        :items="sections"
        :label="$t('survey-schemes.conditions.sections._')"
        outlined
        :value="section"
        @change="update('section', $event)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        hide-details="auto"
        :label="$t('survey-schemes.conditions.promptId')"
        outlined
        :value="promptId"
        @input="update('promptId', $event)"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useSelects } from '@intake24/admin/composables';

export default defineComponent({
  name: 'PromptAnswerProps',

  props: {
    promptId: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { sections } = useSelects();

    const update = (field: string, value: any) => {
      emit(`update:${field}`, value);
    };

    return { sections, update };
  },
});
</script>

<style lang="scss" scoped></style>
