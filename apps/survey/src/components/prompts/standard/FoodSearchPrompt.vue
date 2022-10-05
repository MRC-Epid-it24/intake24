<template>
  <prompt-layout :description="promptProps.description" :text="promptTitle">
    <v-text-field v-model="searchTerm" @change="search"></v-text-field>
    <v-progress-circular v-if="requestInProgress" indeterminate></v-progress-circular>
    <v-alert v-if="requestFailed" prominent type="error">Something went wrong :(</v-alert>
    <v-alert
      v-if="searchResults != null && searchResults.foods.length === 0"
      prominent
      type="warning"
    >
      <p>There is nothing in our database that matches "{{ searchTerm }}".</p>
      <p>Please try re-wording your description.</p></v-alert
    >
    <food-search-results
      v-if="searchResults != null"
      :results="searchResults"
      @food-selected="onFoodSelected"
    ></food-search-results>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapGetters, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { FoodSearchResponse } from '@intake24/common/types/http';
import { submitPromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { FoodSearchResults } from '@intake24/survey/components/elements';
import Submit from '@intake24/survey/components/prompts/actions/Submit.vue';
import { foodsService } from '@intake24/survey/services';
import { useSurvey } from '@intake24/survey/stores';

import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'FoodSearchPrompt',

  components: { FoodSearchResults },

  mixins: [BasePrompt, Submit],

  props: {
    localeId: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    initialSearchTerm: {
      type: String,
      default: '',
    },
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

  computed: {
    ...mapState(useSurvey, ['parameters']),

    promptTitle(): string {
      const { searchTerm } = this;
      return this.getLocaleContent(this.promptProps.text, { params: { searchTerm } });
    },
  },

  mounted() {
    this.search();
  },

  methods: {
    async search() {
      this.requestInProgress = true;
      this.searchResults = null;
      try {
        this.searchResults = await foodsService.search(
          this.localeId,
          this.searchTerm,
          this.parameters?.searchSortingAlgorithm,
          this.parameters?.searchMatchScoreWeight
        );
      } catch (e) {
        this.requestFailed = true;
      }
      this.requestInProgress = false;
    },

    async onFoodSelected(code: string) {
      this.requestInProgress = true;
      this.searchResults = null;
      try {
        const foodData = await foodsService.getData(this.localeId, code);
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
