<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h2>{{ localeDescription }}</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="11">
        <!-- TO DO this won't handle RTL because of the question mark -->
        {{ $t('portion.option.label') }}<i>{{ localeDescription }}</i> ?
      </v-col>
      <v-col cols="1">
        <v-btn color="primary" justify="end">{{ $t('common.help') }}</v-btn>
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
        <v-card :elevation="returnSelectElevation(index)">
          <v-img class="align-end" :src="method.imageUrl" :aspect-ratio="16 / 9">
            <v-chip class="ma-2" :color="returnSelectedStyle(index)">
              {{ localeDescription }}
            </v-chip>

            <template v-slot:placeholder>
              <v-alert outlined text>
                <v-progress-circular
                  indeterminate
                  color="primary"
                  class="mr-2"
                ></v-progress-circular>
                {{ $t('portion.option.imageInvalid') }}
              </v-alert>
            </template>
          </v-img>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-form ref="form" @submit.prevent="onSubmit">
          <!-- Should be disabled if nothing selected? -->
          <continue></continue>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { PortionSizeOptionPromptProps } from '@common/types';
import { portionSizeOptionPromptProps } from '@common/defaults';
import localeContent from '@/components/mixins/localeContent';
import BasePrompt, { Prompt } from './BasePrompt';

// For user to select which portion size estimation method they want to use
export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'PortionSizeOptionPrompt',

  mixins: [BasePrompt, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => PortionSizeOptionPromptProps,
    },
  },

  data() {
    return {
      ...merge(portionSizeOptionPromptProps, this.props),
      errors: [] as string[],
      currentValue: -1,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.localDescription);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  methods: {
    selectMethod(index: number) {
      if (this.currentValue === index) {
        this.currentValue = -1;
      } else {
        this.currentValue = index;
        console.log(`Selected ${index} portion size estimation`);
        this.clearErrors();
      }
    },

    clearErrors() {
      this.errors = [];
    },

    isValid() {
      // Check user has selected a method
      if (this.currentValue !== -1) {
        return true;
      }
      return false;
    },

    // Styling for chip to denote selected
    returnSelectedStyle(index: number) {
      if (this.currentValue === index) {
        return 'green';
      }
      return 'false';
    },

    returnSelectElevation(index: number) {
      // Elevation for card based on selected or not
      if (this.currentValue === index) {
        return 12;
      }
      return 0;
    },

    onSubmit() {
      if (!this.isValid()) {
        // Get either validation message passed in, or the default for the locale
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            (this.$t('prompts.portionoption.validation.required') as string),
        ];
        return;
      }

      this.$emit('portion size option selection', this.methods[this.currentValue]);
    },
  },
});
</script>

<style lang="scss" scoped></style>
