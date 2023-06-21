<template>
  <div>
    <v-tabs v-model="tab" class="food-explorer" grow height="60px" slider-size="3">
      <v-tab key="browse">
        <v-icon left>fas fa-folder-tree</v-icon>
        {{ $t(`prompts.foodBrowser.browse`) }}
      </v-tab>
      <v-tab key="search">
        <v-text-field
          v-model="search"
          clearable
          flat
          hide-details
          :label="$t(`prompts.foodBrowser.search`)"
          :placeholder="$t(`prompts.foodBrowser.search`)"
          prepend-icon="$search"
          solo
        ></v-text-field>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="browse">
        <v-card v-if="requestFailed" flat>
          <v-card-text>
            <v-alert type="error">Something went wrong :(</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn large @click="browseCategory(retryCode)">Try again</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-if="navigationHistory.length > 1" flat>
          <v-btn large text @click="navigateBack"
            ><span class="fa fa-chevron-left mr-2"></span> Back to '{{
              navigationHistory[navigationHistory.length - 2].description
            }}'</v-btn
          >
        </v-card>
        <image-placeholder v-if="requestInProgress" class="my-6"></image-placeholder>
        <category-contents-view
          v-if="currentCategoryContents && !requestInProgress"
          :contents="currentCategoryContents"
          @category-selected="categorySelected"
          @food-selected="foodSelected"
        ></category-contents-view>
      </v-tab-item>
      <v-tab-item key="search">
        <image-placeholder v-if="requestInProgress" class="my-6"></image-placeholder>
        <category-contents-view
          v-if="!requestInProgress"
          :contents="searchContents"
          @category-selected="categorySelected"
          @food-selected="foodSelected"
        ></category-contents-view>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { watchDebounced } from '@vueuse/core';
import { computed, defineComponent, onMounted, ref } from 'vue';

import type { CategoryContents, CategoryHeader, FoodHeader } from '@intake24/common/types/http';
import { categoriesService } from '@intake24/survey/services';

import CategoryContentsView from './CategoryContentsView.vue';
import ImagePlaceholder from './ImagePlaceholder.vue';

export default defineComponent({
  name: 'FoodBrowser',

  components: { CategoryContentsView, ImagePlaceholder },

  props: {
    localeId: {
      type: String,
      required: true,
    },
    rootCategory: {
      type: String,
    },
  },

  emits: ['food-selected'],

  setup(props, { emit }) {
    const search = ref('');
    const searchResults = ref<FoodHeader[]>([]);

    const searchContents = computed<CategoryContents>(() => ({
      header: { code: props.rootCategory ?? 'root', description: props.rootCategory ?? 'root' },
      foods: searchResults.value,
      subcategories: [],
    }));

    const navigationHistory = ref<CategoryHeader[]>([]);
    const retryCode = ref(props.rootCategory);
    const currentCategoryContents = ref<CategoryContents | undefined>(undefined);

    const requestInProgress = ref(true);
    const requestFailed = ref(false);
    const tab = ref(0);

    const browseCategory = async (categoryCode: string) => {
      requestInProgress.value = true;
      retryCode.value = categoryCode;

      try {
        const contents = await categoriesService.contents(props.localeId, categoryCode);

        requestInProgress.value = false;
        requestFailed.value = false;
        navigationHistory.value.push(contents.header);
        currentCategoryContents.value = contents;
      } catch (err) {
        requestInProgress.value = false;
        requestFailed.value = true;
      }
    };

    const searchCategory = async () => {
      if (!props.rootCategory) return;
      requestInProgress.value = true;

      try {
        const { data } = await categoriesService.search(props.localeId, props.rootCategory, {
          search: search.value,
          limit: 25,
        });

        searchResults.value = data;

        requestInProgress.value = false;
        requestFailed.value = false;
      } catch (err) {
        requestInProgress.value = false;
        requestFailed.value = true;
      }
    };

    const categorySelected = (category: CategoryHeader) => {
      browseCategory(category.code);
    };

    const foodSelected = (food: FoodHeader) => {
      emit('food-selected', food);
    };

    const navigateBack = () => {
      if (navigationHistory.value.length < 2) {
        console.warn('Navigation history length should be at least 2 at this point');
      } else {
        const previousCategory = navigationHistory.value.splice(
          navigationHistory.value.length - 2,
          2
        );
        browseCategory(previousCategory[0].code);
      }
    };

    onMounted(async () => {
      if (props.rootCategory) await browseCategory(props.rootCategory);
    });

    watchDebounced(
      search,
      async () => {
        if (!search.value) {
          searchResults.value = [];
          return;
        }

        if (search.value.length < 2) return;

        await searchCategory();
      },
      { debounce: 500, maxWait: 2000 }
    );

    return {
      navigationHistory,
      retryCode,
      currentCategoryContents,
      requestInProgress,
      requestFailed,
      tab,
      browseCategory,
      categorySelected,
      foodSelected,
      navigateBack,
      search,
      searchCategory,
      searchContents,
      searchResults,
    };
  },
});
</script>

<style lang="scss">
.food-explorer {
  .v-tab {
    flex: 1 1 50% !important;
  }
}
</style>
