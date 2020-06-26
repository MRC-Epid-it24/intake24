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
import Vue, { PropType } from 'vue';
import merge from 'deepmerge';
import { BasePromptProps } from '@/types/prompts';
import BasePrompt from './BasePrompt';
import { baseDefaults } from './promptDefaults';

export default Vue.extend({
  name: 'SubmitPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as PropType<BasePromptProps>,
    },
  },

  data() {
    return { ...merge(baseDefaults, this.props) };
  },

  methods: {
    onSubmit() {
      this.$emit('submit');
    },
  },
});
</script>

<style lang="scss" scoped></style>
