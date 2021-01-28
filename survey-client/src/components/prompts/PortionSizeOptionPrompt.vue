<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h2>{{ localDescription }}</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="11">
        <!-- Requires handling of the translation -->
        How would you like to estimate the portion size of your <i>{{ localDescription }}</i>?
      </v-col>
      <v-col cols="1">
        <v-btn justify="end">Help</v-btn>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col
        v-for="(method, index) in methods"
        :key="index"
        cols="6"
        @click="selectMethod(index)"
        class="mx-auto"
      >
        <v-card>
          <v-card-title>
            {{ text }} {{ method.method }} 
            <v-icon 
              class="mr-1"
              v-show="isSelected(index)"
              color="green"
            >
              fas fa-fw fa-check
            </v-icon>
          </v-card-title>

          <v-img 
            :src="method.imageUrl"
          ></v-img>

          <v-card-text 
            v-text="method.description"
          ></v-card-text>

          <v-card-actions>
          </v-card-actions>

        </v-card>
      <!-- :error="hasErrors" -->
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <continue @click="onSubmit()"></continue>
      </v-col>
    </v-row>
  </v-container>

  <!-- <prompt-layout :text="text" :description="description">
    <v-card-text>
      
      <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
      <v-form ref="form" @submit.prevent="onSubmit">
        <continue></continue>
      </v-form>
    </v-card-text>
  </prompt-layout> -->
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
      currentValue: -1, 
    };
  },

  methods: {
    // clearErrors() {
    //   this.errors = [];
    // },

    selectMethod(index: number) {
      this.currentValue = index;
      console.log(`Selected ${index} portion size estimation`)
    },

    isSelected(index: number) {
      if (this.currentValue === index) {
        return true;
      }
      return false;
    },

    isValid() {
      // Check user has selected a method
      if (this.currentValue !== -1) {
        return true;
      }
      return false;
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

      this.$emit('portion size option answer', this.methods[this.currentValue]);
    },
  },
});
</script>

<style lang="scss" scoped></style>
