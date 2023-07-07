<template>
  <div>
    <component :is="dialog ? `food-browser-dialog` : `v-card`" v-model="dialog" :flat="!dialog">
      <div :class="{ 'px-4': dialog, 'pt-4': dialog }">
        <v-text-field
          ref="searchRef"
          v-model="search"
          clearable
          flat
          hide-details
          :label="$t(`prompts.foodBrowser.search`)"
          outlined
          :placeholder="$t(`prompts.foodBrowser.search`)"
          prepend-inner-icon="$search"
          @focus="openInDialog"
        ></v-text-field>
      </div>
      <v-tabs-items v-show="dialog || !showInDialog" v-model="tab">
        <v-tab-item key="browse">
          <v-card v-if="requestFailed" flat>
            <v-card-text>
              <v-alert type="error">Something went wrong :(</v-alert>
            </v-card-text>
            <v-card-actions>
              <v-btn large @click="browseCategory(retryCode)">Try again</v-btn>
            </v-card-actions>
          </v-card>
          <v-btn v-if="navigationHistory.length > 1" class="my-1" large text @click="navigateBack">
            <v-icon left>fas fa-turn-up fa-flip-horizontal</v-icon>
            {{
              $t(`prompts.foodBrowser.back`, {
                category: navigationHistory[navigationHistory.length - 2].description,
              })
            }}
          </v-btn>
          <v-subheader v-else class="font-weight-bold">
            {{ $t('prompts.foodBrowser.browse') }}
          </v-subheader>
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
      <div v-if="dialog || !showInDialog" class="pa-4">
        <v-btn
          :block="isMobile"
          color="secondary"
          :disabled="missingDialog"
          large
          outlined
          :title="$t(`prompts.${type}.missing.label`)"
          @click.stop="openMissingDialog"
        >
          {{ $t(`prompts.${type}.missing.label`) }}
        </v-btn>
      </div>
    </component>
    <missing-food-panel
      v-model="missingDialog"
      :class="{ 'mt-4': isMobile }"
      :type="type"
      @cancel="closeMissingDialog"
      @confirm="foodMissing"
    ></missing-food-panel>
  </div>
</template>

<script lang="ts">
import type { VTextField } from 'vuetify/lib';
import { watchDebounced } from '@vueuse/core';
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import { VCard } from 'vuetify/lib';

import type { CategoryContents, CategoryHeader, FoodHeader } from '@intake24/common/types/http';
import { categoriesService } from '@intake24/survey/services';

import CategoryContentsView from './CategoryContentsView.vue';
import FoodBrowserDialog from './FoodBrowserDialog.vue';
import ImagePlaceholder from './ImagePlaceholder.vue';
import MissingFoodPanel from './MissingFoodPanel.vue';

export default defineComponent({
  name: 'FoodBrowser',

  components: {
    CategoryContentsView,
    ImagePlaceholder,
    FoodBrowserDialog,
    MissingFoodPanel,
    VCard,
  },

  props: {
    inDialog: {
      type: Boolean,
      default: true,
    },
    localeId: {
      type: String,
      required: true,
    },
    rootCategory: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
  },

  emits: ['food-selected', 'food-missing'],

  setup(props, { emit }) {
    const showInDialog = computed(
      () => props.inDialog && searchRef.value?.$vuetify.breakpoint.mobile
    );

    const dialog = ref(false);

    const openInDialog = async () => {
      if (!showInDialog.value || dialog.value) return;

      dialog.value = true;

      await nextTick();
      //@ts-expect-error - vuetify types
      searchRef.value?.focus();
    };

    const closeInDialog = () => {
      dialog.value = false;
    };

    const missingDialog = ref(false);

    const openMissingDialog = () => {
      missingDialog.value = true;
      dialog.value = false;
    };

    const closeMissingDialog = async () => {
      if (!searchRef.value) return;

      missingDialog.value = false;

      setTimeout(async () => {
        if (!searchRef.value) return;

        await searchRef.value.$vuetify.goTo(searchRef.value.$el as HTMLElement, {
          duration: 500,
        });

        //@ts-expect-error - vuetify types
        searchRef.value.focus();
      }, 100);
    };

    const search = ref('');
    const searchRef = ref<InstanceType<typeof VTextField>>();
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
      closeInDialog();
      emit('food-selected', food);
    };

    const foodMissing = (food: FoodHeader) => {
      closeInDialog();
      emit('food-missing', food);
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
          tab.value = 0;
          return;
        }

        tab.value = 1;
        await searchCategory();
      },
      { debounce: 500, maxWait: 2000 }
    );

    return {
      dialog,
      showInDialog,
      openInDialog,
      closeInDialog,
      missingDialog,
      openMissingDialog,
      closeMissingDialog,
      navigationHistory,
      retryCode,
      currentCategoryContents,
      requestInProgress,
      requestFailed,
      tab,
      browseCategory,
      categorySelected,
      foodMissing,
      foodSelected,
      navigateBack,
      search,
      searchCategory,
      searchContents,
      searchRef,
      searchResults,
    };
  },
});
</script>

<style lang="scss"></style>
