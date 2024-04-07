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
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useSelects } from '@intake24/admin/composables';

export default defineComponent({
  name: 'SectionProps',

  props: {
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
