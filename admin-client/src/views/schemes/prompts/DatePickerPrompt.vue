<template>
  <div>
    <prompt-validation v-bind.sync="validation"></prompt-validation>
    <v-row>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PromptValidation from './PromptValidation.vue';
import prompt from './prompt';

export default Vue.extend({
  name: 'DatePickerPrompt',

  components: { PromptValidation },

  mixins: [prompt],
});
</script>

<style lang="scss" scoped></style>
