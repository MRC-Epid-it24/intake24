<template>
  <v-container fluid>
    <v-row dense>
      <v-col
        v-for="(method, index) in methods"
        :key="index"
        cols="6"
        @click="selectMethod(index)"
      >
        <v-card>
          <v-card-title>
            {{ text }} {{ method.method }}
          </v-card-title>

          <v-img 
            :src="method.imageUrl"
          ></v-img>

          <v-card-text 
            v-text="method.description"
          ></v-card-text>

          <v-spacer></v-spacer>

          <v-icon v-show="highlightCard(index)" large color="green">fas fa-fw fa-check</v-icon>

        </v-card>
      <!-- :error="hasErrors" -->
      <!-- :click="selectMethod(method.method)" -->
      
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

    highlightCard(index: number) {
      if (this.currentValue === index) {
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

      this.$emit('portion size option answer', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
