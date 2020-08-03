<template>
  <prompt-layout :text="text" :description="description">
    <v-row justify="center">
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-card-actions class="mt-3">
          <v-btn
            color="success"
            type="submit"
            class="px-5"
            :block="$vuetify.breakpoint.xsOnly"
            x-large
          >
            {{ $t('recall.submit') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-row>
  </prompt-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import merge from 'deepmerge';
import { BasePromptProps } from '@common/types/promptProps';
import { submitPromptProps } from '@common/prompts/promptDefaults';
import BasePrompt from './BasePrompt';

export default Vue.extend({
  name: 'SubmitPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as () => BasePromptProps,
    },
  },

  data() {
    return { ...merge(submitPromptProps, this.props) };
  },

  methods: {
    onSubmit() {
      this.$emit('submit');
    },
  },
});
</script>

<style lang="scss" scoped></style>
