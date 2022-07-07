<template>
  <prompt-layout :text="promptTitle" :description="promptProps.description">
    <v-text-field v-model="searchTerm" @change="search"></v-text-field>
    <v-progress-circular indeterminate v-if="requestInProgress"></v-progress-circular>
    <v-alert type="error" prominent v-if="requestFailed">Something went wrong :(</v-alert>
    <v-alert
      type="warning"
      prominent
      v-if="searchResults != null && searchResults.foods.length === 0"
    >
      <p>There is nothing in our database that matches "{{ searchTerm }}".</p>
      <p>Please try re-wording your description.</p></v-alert
    >
    <food-search-results
      :results="searchResults"
      v-if="searchResults != null"
      @food-selected="onFoodSelected"
    ></food-search-results>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { merge } from '@intake24/common/util';
import type { BasePromptProps } from '@intake24/common/prompts';
import { submitPromptProps } from '@intake24/common/prompts';
import type { LocaleTranslation } from '@intake24/common/types';
import { replaceInTranslation } from '@intake24/common/types';
import type { FoodSearchResponse } from '@intake24/common/types/http';
import Submit from '@intake24/survey/components/prompts/actions/Submit.vue';
import foodSearchService from '@intake24/survey/services/foods.service';
import FoodSearchResults from '@intake24/survey/components/elements/FoodSearchResults.vue';
import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'FoodSearchPrompt',

  components: { FoodSearchResults },

  mixins: [BasePrompt, Submit],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    initialSearchTerm: {
      type: String,
      default: '',
    },
  },

  computed: {
    promptTitle(): LocaleTranslation {
      return replaceInTranslation(this.promptProps.text, '{searchTerm}', this.searchTerm);
    },
  },

  mounted() {
    this.search();
  },

  data() {
    return {
      ...merge(submitPromptProps, this.promptProps),
      requestInProgress: true,
      requestFailed: false,
      searchTerm: this.initialSearchTerm,
      searchResults: null as FoodSearchResponse | null,
    };
  },

  methods: {
    async search() {
      this.requestInProgress = true;
      this.searchResults = null;
      try {
        this.searchResults = await foodSearchService.search('en_GB', this.searchTerm);
      } catch (e) {
        this.requestFailed = true;
      }
      this.requestInProgress = false;
    },

    async onFoodSelected(code: string) {
      this.requestInProgress = true;
      this.searchResults = null;
      try {
        const foodData = await foodSearchService.getData('en_GB', code);
        this.$emit('food-selected', foodData);
      } catch (e) {
        this.requestFailed = true;
      }
      this.requestInProgress = false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
