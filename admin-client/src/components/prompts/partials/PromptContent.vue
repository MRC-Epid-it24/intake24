<template>
  <v-tab-item key="content">
    <v-row>
      <v-col cols="12">
        <v-text-field
          :label="$t('schemes.questions.text')"
          :rules="textRules"
          :value="text"
          hide-details="auto"
          outlined
          @input="update('text', $event)"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-label class="mt-4 mb-2">{{ $t('schemes.questions.description') }}</v-label>
        <editor :init="tinymceInit" :value="description" @input="update('description', $event)" />
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import Vue from 'vue';
import tinymce from '@/components/tinymce/tinymce';

export default Vue.extend({
  name: 'PromptContent',

  mixins: [tinymce],

  props: {
    text: {
      type: String,
    },
    description: {
      type: String,
    },
  },

  computed: {
    textRules() {
      return [(value: string | null): boolean | string => !!value || 'Question text is required.'];
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
