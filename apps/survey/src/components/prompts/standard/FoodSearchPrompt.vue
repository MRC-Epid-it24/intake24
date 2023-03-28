<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-text-field
        v-model="searchTerm"
        class="mb-4"
        clearable
        hide-details="auto"
        label="Search food"
        outlined
        prepend-inner-icon="$search"
        @change="search"
      ></v-text-field>
      <image-placeholder v-if="requestInProgress"></image-placeholder>
      <v-alert v-if="requestFailed" prominent type="error">Something went wrong :(</v-alert>
      <v-alert
        v-if="searchResults && !searchResults.foods.length"
        border="left"
        outlined
        prominent
        type="warning"
      >
        <p>{{ $t(`prompts.${type}.empty`, { searchTerm }) }}</p>
        <p>{{ $t(`prompts.${type}.reword`) }}</p>
      </v-alert>
      <food-search-results
        v-if="searchResults"
        :results="searchResults"
        @food-selected="onFoodSelected"
      ></food-search-results>
      <v-card-text>
        <v-btn
          :block="isMobile"
          :class="{ 'mb-2': isMobile }"
          color="secondary"
          large
          outlined
          :title="$t(`prompts.${type}.browse`)"
        >
          {{ $t(`prompts.${type}.browse`) }}
        </v-btn>
        <v-btn
          :block="isMobile"
          :class="{ 'ml-2': !isMobile }"
          color="secondary"
          large
          outlined
          :title="$t(`prompts.${type}.missing`)"
          @click.stop="$emit('missing-food')"
        >
          {{ $t(`prompts.${type}.missing`) }}
        </v-btn>
      </v-card-text>
    </v-card-text>
    <template #actions>
      <!-- Should not have actions -> only click & select -->
      <div></div>
    </template>
  </card-layout>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { FreeTextFood } from '@intake24/common/types';
import type { FoodSearchResponse } from '@intake24/common/types/http';
import { FoodSearchResults, ImagePlaceholder } from '@intake24/survey/components/elements';
import { foodsService } from '@intake24/survey/services';
import { useSurvey } from '@intake24/survey/stores';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'FoodSearchPrompt',

  components: { FoodSearchResults, ImagePlaceholder },

  mixins: [createBasePrompt<'food-search-prompt', FreeTextFood>()],

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

  emits: ['food-selected', 'input', 'missing-food'],

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
