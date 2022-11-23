<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        hide-details="auto"
        item-value="value"
        :items="sections"
        :label="$t('survey-schemes.conditions.sections._')"
        outlined
        :value="section"
        @change="update('section', $event)"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import sectionMixin from './section-mixin';

export default defineComponent({
  name: 'SectionProps',

  mixins: [sectionMixin],

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
  },
});
</script>

<style lang="scss" scoped></style>
