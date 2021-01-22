<template>
  <prompt-layout :text="text" :description="description">
    <v-card-text>
      <v-row>
        <v-col>
        <!-- <v-col 
          v-for="method in methods" 
          :key="method.foodCode"
          :click="selectMethod(method.method)"
          :error="hasErrors"
        > -->
          <!-- <img src="" alt=""> -->
          <!-- {{ method.description }} -->
          Any other content inside the prompt
        </v-col>
      </v-row>
      <!-- <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
      <v-form ref="form" @submit.prevent="onSubmit">
        <continue></continue>
      </v-form> -->
    </v-card-text>
  </prompt-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import merge from 'deepmerge';
import { PortionSizeOptionPromptProps } from '@common/types/promptProps';
import { portionSizeOptionPromptProps } from '@common/prompts/promptDefaults';
import BasePrompt, { Prompt } from './BasePrompt';

export default Vue.extend({
  // For user to select which portion size estimation method they want to use
  name: 'PortionSizeOptionPrompt',

  mixins: [BasePrompt],

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => PortionSizeOptionPromptProps,
    },
  },

  data() {
    return {
      ...merge(portionSizeOptionPromptProps, this.props),
      currentValue: 'ok', 
    };
  },

  methods: {
    // clearErrors() {
    //   this.errors = [];
    // },

    // selectMethod(method: string) {
    //   this.currentValue = method;
    //   console.log(`Selected ${method} portion size estimation`)
    // },

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
