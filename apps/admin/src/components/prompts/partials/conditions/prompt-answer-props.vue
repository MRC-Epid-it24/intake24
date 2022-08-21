<template>
  <v-col cols="12" md="6">
    <v-text-field
      :label="$t('survey-schemes.conditions.promptId')"
      :value="promptId"
      hide-details="auto"
      outlined
      @input="update('promptId', $event)"
    ></v-text-field>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
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
