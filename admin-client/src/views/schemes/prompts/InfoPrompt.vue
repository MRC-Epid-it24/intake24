<template>
  <v-row justify="center">
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
import Editor from '@tinymce/tinymce-vue';
import prompt from './prompt';

export default Vue.extend({
  name: 'InfoPrompt',

  components: { Editor },

  mixins: [prompt],
});
</script>

<style lang="scss" scoped></style>
