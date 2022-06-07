<template>
  <div>
    <v-card flat v-if="requestFailed">
      <v-card-text>
        <v-alert type="error">Something went wrong :(</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn large @click="browseCategory(retryCode)">Try again</v-btn>
      </v-card-actions>
    </v-card>

    <v-row v-if="requestInProgress">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-row>

    <CategoryContentsView
      :contents="currentCategoryContents"
      v-if="currentCategoryContents && !requestInProgress"
      @category-selected="onCategorySelected"
      @food-selected="onFoodSelected"
    ></CategoryContentsView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { CategoryContents, CategoryHeader, FoodSearchResponse } from '@intake24/common/types/http';

import CategoryContentsView from '@intake24/survey/components/elements/CategoryContentsView.vue';
import categoriesService from '@intake24/survey/services/categories.service';

export default defineComponent({
  name: 'FoodBrowser',
  components: { CategoryContentsView },

  props: {
    rootCategory: String,
  },

  data() {
    return {
      retryCode: this.rootCategory,
      currentCategory: undefined as CategoryHeader | undefined,
      currentCategoryContents: undefined as CategoryContents | undefined,
      requestInProgress: true,
      requestFailed: false,
    };
  },

  mounted() {
    if (this.rootCategory) this.browseCategory(this.rootCategory);
  },

  methods: {
    browseCategory(categoryCode: string): void {
      this.requestInProgress = true;
      this.retryCode = categoryCode;
      categoriesService.browse('en_GB', categoryCode).then(
        (contents) => {
          this.requestInProgress = false;
          this.requestFailed = false;
          this.currentCategoryContents = contents;
        },
        (error) => {
          this.requestInProgress = false;
          this.requestFailed = true;
        }
      );
    },

    onCategorySelected(category: CategoryHeader): void {
      this.currentCategory = category;
      this.browseCategory(category.code);
    },

    onFoodSelected(foodCode: string): void {
      this.$emit('food-selected', foodCode);
    },
  },
});
</script>
