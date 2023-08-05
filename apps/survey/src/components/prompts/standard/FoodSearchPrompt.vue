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
      <v-card-text v-if="recipeBuilder">
        <v-btn
          :block="isMobile"
          :class="{ 'ml-2': !isMobile }"
          color="secondary"
          :disabled="!recipeBuilder"
          large
          outlined
          :v-model="recipeBuilderFood?.description"
          @click.stop="recipeBuilder = true"
        >
          {{
            $t(`prompts.${type}.recipeBuilder.label`, {
              recipeBuilderFood: recipeBuilderFood?.description,
            })
          }}
        </v-btn>
      </v-card-text>
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
          :disabled="missing"
          large
          outlined
          :title="$t(`prompts.${type}.missing.label`)"
          @click.stop="missing = true"
        >
          {{ $t(`prompts.${type}.missing.label`) }}
        </v-btn>
      </v-card-text>
      <missing-food-panel
        v-model="missing"
        :type="type"
        @cancel="missing = false"
        @confirm="$emit('food-missing')"
      ></missing-food-panel>
      <confirm-dialog
        v-model="confirmDialog"
        external
        :label="$t('prompts.foodSearch.confirmDiscardFood.label').toString()"
        @cancel="confirmDialogResolve(false)"
        @confirm="confirmDialogResolve(true)"
      >
        <!-- FIXME: Intended message is prompts.foodSearch.confirmDiscardFood.messageUnsafe,
                    but food names must be sanitized in order to use HTML here -->
        {{
          $t('prompts.foodSearch.confirmDiscardFood.message', {
            discardedFoodName,
            selectedFoodName,
          })
        }}
      </confirm-dialog>
    </v-card-text>
    <template #actions>
      <!-- Should not have actions -> only click & select -->
      <div></div>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { SearchSortingAlgorithm } from '@intake24/common/surveys';
import type { FreeTextFood } from '@intake24/common/types';
import type { FoodHeader, FoodSearchResponse } from '@intake24/common/types/http';
import {
  FoodSearchResults,
  ImagePlaceholder,
  MissingFoodPanel,
} from '@intake24/survey/components/elements';
import { foodsService } from '@intake24/survey/services';
import { ConfirmDialog } from '@intake24/ui';

import createBasePrompt from '../createBasePrompt';

export type FoodSearchPromptParameters = {
  matchScoreWeight?: number;
  rankingAlgorithm?: SearchSortingAlgorithm;
};

export default defineComponent({
  name: 'FoodSearchPrompt',

  components: { FoodSearchResults, ImagePlaceholder, MissingFoodPanel, ConfirmDialog },

  mixins: [createBasePrompt<'food-search-prompt', FreeTextFood>()],

  props: {
    discardedFoodName: {
      type: String,
      required: false,
    },
    localeId: {
      type: String,
      required: true,
    },
    parameters: {
      type: Object as PropType<FoodSearchPromptParameters>,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },

  emits: ['food-missing', 'food-selected', 'input', 'recipe-builder'],

  setup(props) {
    const missing = ref(false);
    const recipeBuilder = ref(false);
    const recipeBuilderFood = ref<FoodHeader | null>(null);
    const requestInProgress = ref(true);
    const requestFailed = ref(false);
    const searchTerm = ref(props.value);
    const searchResults = ref<FoodSearchResponse | null>(null);
    const selectedFoodName = ref<string | null>(null);

    const confirmDialog = ref(false);
    const confirmDialogResolve = ref<((v: boolean) => void) | null>(null);

    return {
      missing,
      recipeBuilder,
      recipeBuilderFood,
      requestInProgress,
      requestFailed,
      searchTerm,
      searchResults,
      confirmDialog,
      selectedFoodName,
      confirmDialogResolve,
    };
  },

  async mounted() {
    await this.search();
  },

  methods: {
    async search() {
      this.$emit('input', this.searchTerm);
      this.requestInProgress = true;
      this.searchResults = null;

      const { matchScoreWeight, rankingAlgorithm } = this.parameters;

      try {
        this.searchResults = await foodsService.search(this.localeId, this.searchTerm, {
          rankingAlgorithm,
          matchScoreWeight,
          recipe: false,
        });
        this.requestFailed = false;
        if (this.searchResults.foods[0].code.charAt(0) === '$') {
          this.recipeBuilderFood = this.searchResults.foods[0];
          this.recipeBuilder = true;
        }
        // console.log(`Got some Builder Food ${this.searchResults.foods[0].code}}`);
      } catch (e) {
        this.requestFailed = true;
      }
      this.requestInProgress = false;
    },

    async showConfirmDialog(selectedFood: FoodHeader): Promise<boolean> {
      this.selectedFoodName = selectedFood.description;
      this.confirmDialog = true;

      return new Promise<boolean>((resolve) => {
        this.confirmDialogResolve = resolve;
      });
    },

    async onFoodSelected(food: FoodHeader) {
      if (this.discardedFoodName && !(await this.showConfirmDialog(food))) return;

      this.requestInProgress = true;
      this.searchResults = null;
      try {
        const foodData = await foodsService.getData(this.localeId, food.code);
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
