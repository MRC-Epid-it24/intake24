<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-switch
        :input-value="required"
        :label="$t('schemes.questions.validation.required')"
        hide-details="auto"
        @change="$emit('update:required', $event)"
      ></v-switch>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        :value="message"
        :disabled="!required"
        :label="$t('schemes.questions.validation.message')"
        hide-details="auto"
        outlined
        @input="$emit('update:message', $event)"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PromptValidation',

  props: {
    required: {
      type: Boolean,
    },
    message: {
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped></style>
