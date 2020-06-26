<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-switch
        :input-value="validation.required"
        :label="$t('schemes.questions.validation.required')"
        hide-details="auto"
        @change="$emit('update:validation.required', $event)"
      ></v-switch>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        :value="validation.message"
        :disabled="!validation.required"
        :label="$t('schemes.questions.validation.message')"
        hide-details="auto"
        outlined
        @input="$emit('update:validation.message', $event)"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-sheet color="grey" height="2px" width="100%"></v-sheet>
    </v-col>
    <v-col cols="12">
      <v-text-field
        :value="text"
        :label="$t('schemes.questions.text')"
        :rules="textRules"
        hide-details="auto"
        outlined
        @input="$emit('update:text', $event)"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="mt-4 mb-2">{{ $t('schemes.questions.description') }}</v-label>
      <editor
        :init="tinymceInit"
        :value="description"
        @input="$emit('update:description', $event)"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import prompt from './prompt';

export default Vue.extend({
  name: 'DatePickerPrompt',

  mixins: [prompt],
});
</script>

<style lang="scss" scoped></style>
