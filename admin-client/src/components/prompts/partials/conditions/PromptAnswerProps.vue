<template>
  <v-col cols="12" md="6">
    <v-text-field
      :label="$t('schemes.conditions.promptId')"
      :value="promptId"
      @input="update('promptId', $event)"
      hide-details="auto"
      outlined
    ></v-text-field>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PromptAnswerProps',

  props: {
    promptId: {
      type: String,
      required: true,
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
  },
});
</script>

<style lang="scss" scoped></style>
