<template>
  <prompt-layout :foodName="text" :description="description">
    <v-card-text>
      <v-row>
        <v-col
          v-for="method in methods"
          :key="method.foodCode"
          :click="selectMethod(method.method)"
          :error="hasErrors"
        >
          <!-- <img src="" alt=""> -->
          {{ method.description }}
        </v-col>
      </v-row>
      <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
      <v-form ref="form" @submit.prevent="onSubmit">
        <continue></continue>
      </v-form>
    </v-card-text>
  </prompt-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import merge from 'deepmerge';
import { PortionSizeOptionPromptProps } from '@common/types';
import { portionSizeOptionPromptProps } from '@common/prompts/promptDefaults';
import BasePrompt from './BasePrompt';

export default Vue.extend({
  // For user to select which portion size estimation method they want to use
  name: 'PortionSizeOptionPrompt',

  mixins: [BasePrompt],

  props: {
    props: {
      type: Object as () => PortionSizeOptionPromptProps,
    },
  },

  data() {
    return {
      ...merge(portionSizeOptionPromptProps, this.props),
      errors: [] as string[],
      // Temporary until API exists
      // TO DO structure data correctly
      currentValue: null,
      methods: [
        {
          method: 'as-served',
          foodCode: 'ABC',
          description: 'in straight cut chips',
        },
        {
          method: 'as-served',
          foodCode: 'ABD',
          description: 'in thick cut chips',
        },
        {
          method: 'as-served',
          foodCode: 'ABE',
          description: 'in crinkle cut chips',
        },
      ],
    };
  },

  computed: {
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    selectMethod(method: string) {
      this.currentValue = method;
      console.log(`Selected ${method} portion size estimation`);
    },

    onSubmit() {
      // TO DO implement validation - checking at least one method has been selected
      // if (this.validation.required && !this.currentValue) {
      //   this.errors = [
      //     this.getLocaleContent(this.validation.message) ??
      //       (this.$t('prompts.radio.validation.required') as string),
      //   ];
      //   return;
      // }

      this.$emit('portion size option answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
