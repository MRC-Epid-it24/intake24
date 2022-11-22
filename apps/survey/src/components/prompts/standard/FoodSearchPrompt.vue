<template>
  <prompt-layout
    v-bind="{ actions, description, text: promptTitle, food, meal, isValid }"
    @action="action"
  >
    <v-text-field
      v-model="searchTerm"
      clearable
      hide-details="auto"
      label="Search food"
      outlined
      prepend-inner-icon="$search"
      @change="search"
    ></v-text-field>
    <image-placeholder v-if="requestInProgress"></image-placeholder>
    <v-alert v-if="requestFailed" prominent type="error">Something went wrong :(</v-alert>
    <v-alert v-if="searchResults && !searchResults.foods.length" prominent type="warning">
      <p>{{ $t('prompts.foodBrowser.empty', { searchTerm }) }}</p>
      <p>{{ $t('prompts.foodBrowser.reword') }}</p>
    </v-alert>
    <food-search-results
      v-if="searchResults"
      :results="searchResults"
      @food-selected="onFoodSelected"
    ></food-search-results>
  </prompt-layout>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { FoodSearchPromptProps } from '@intake24/common/prompts';
import type { FoodSearchResponse } from '@intake24/common/types/http';
import { FoodSearchResults, ImagePlaceholder } from '@intake24/survey/components/elements';
import { foodsService } from '@intake24/survey/services';
import { useSurvey } from '@intake24/survey/stores';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'FoodSearchPrompt',

  components: { FoodSearchResults, ImagePlaceholder },

  mixins: [createBasePrompt<FoodSearchPromptProps>()],

  props: {
    localeId: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      requestInProgress: true,
      requestFailed: false,
      searchTerm: this.value,
      searchResults: null as FoodSearchResponse | null,
    };
  },

  computed: {
    ...mapState(useSurvey, ['parameters']),

    promptTitle(): string {
      const { searchTerm } = this;
      return this.getLocaleContent(this.text, { params: { searchTerm } });
    },
  },

  async mounted() {
    await this.search();
  },

  methods: {
    async search() {
      this.$emit('input', this.searchTerm);
      this.requestInProgress = true;
      this.searchResults = null;

      const { searchSortingAlgorithm: rankingAlgorithm, searchMatchScoreWeight: matchScoreWeight } =
        this.parameters ?? {};

      try {
        this.searchResults = await foodsService.search(this.localeId, this.searchTerm, {
          rankingAlgorithm,
          matchScoreWeight,
          recipe: false,
        });
        this.requestFailed = false;
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
