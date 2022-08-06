<template>
  <v-row>
    <v-col class="pl-0 pr-0">
      <v-card flat v-if="requestFailed">
        <v-card-text>
          <v-alert type="error">Something went wrong :(</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn large @click="browseCategory(retryCode)">Try again</v-btn>
        </v-card-actions>
      </v-card>

      <v-container v-if="navigationHistory.length > 1">
        <v-btn large text @click="onNavigateBack()"
          ><span class="fa fa-chevron-left mr-2"></span> Back to '{{
            navigationHistory[navigationHistory.length - 2].description
          }}'</v-btn
        >
      </v-container>

      <v-container class="text-center" v-if="requestInProgress">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-container>

      <CategoryContentsView
        :contents="currentCategoryContents"
        v-if="currentCategoryContents && !requestInProgress"
        @category-selected="onCategorySelected"
        @food-selected="onFoodSelected"
      ></CategoryContentsView>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { CategoryContents, CategoryHeader, FoodHeader } from '@intake24/common/types/http';
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
      navigationHistory: [] as CategoryHeader[],
      retryCode: this.rootCategory,
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
          this.navigationHistory.push(contents.header);
          this.currentCategoryContents = contents;
        },
        () => {
          this.requestInProgress = false;
          this.requestFailed = true;
        }
      );
    },

    onCategorySelected(category: CategoryHeader): void {
      this.currentCategory = category;
      this.browseCategory(category.code);
    },

    onFoodSelected(food: FoodHeader): void {
      this.$emit('food-selected', food);
    },

    onNavigateBack(): void {
      if (this.navigationHistory.length < 2) {
        console.warn('Navigation history length should be at least 2 at this point');
      } else {
        const previousCategory = this.navigationHistory.splice(
          this.navigationHistory.length - 2,
          2
        );
        this.browseCategory(previousCategory[0].code);
      }
    },
  },
});
</script>
