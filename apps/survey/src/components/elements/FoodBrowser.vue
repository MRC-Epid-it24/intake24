<template>
  <div>
    <component
      :is="dialog ? `food-browser-dialog` : `v-card`"
      :dialog.sync="dialog"
      :flat="!dialog"
    >
      <div class="pb-2" :class="{ 'px-4 pt-4': dialog }">
        <v-text-field
          ref="searchRef"
          v-model="searchTerm"
          clearable
          flat
          hide-details
          :label="promptI18n.search"
          outlined
          :placeholder="promptI18n.search"
          prepend-inner-icon="$search"
          :rounded="dialog"
          @focus="openInDialog"
        ></v-text-field>
      </div>
      <v-tabs-items v-show="type === 'foodSearch' || dialog || !showInDialog" v-model="tab">
        <v-tab-item key="browse">
          <v-card v-if="requestFailed" flat>
            <v-card-text>
              <v-alert type="error">Something went wrong :(</v-alert>
            </v-card-text>
            <v-card-actions>
              <v-btn large @click="browseCategory(retryCode)">Try again</v-btn>
            </v-card-actions>
          </v-card>
          <v-btn v-if="navigationHistory.length > 1" large text @click="navigateBack">
            <v-icon left>fas fa-turn-up fa-flip-horizontal</v-icon>
            {{ promptI18n.back }}
          </v-btn>
          <v-subheader v-else class="font-weight-bold">
            {{ promptI18n.browse }}
          </v-subheader>
          <image-placeholder v-if="requestInProgress" class="my-6"></image-placeholder>
          <category-contents-view
            v-if="currentCategoryContents && !requestInProgress"
            :contents="currentCategoryContents"
            :i18n="promptI18n"
            @category-selected="categorySelected"
            @food-selected="foodSelected"
          ></category-contents-view>
        </v-tab-item>
        <v-tab-item key="search">
          <image-placeholder v-if="requestInProgress" class="my-6"></image-placeholder>
          <category-contents-view
            v-if="!requestInProgress"
            :contents="searchContents"
            :i18n="promptI18n"
            @category-selected="categorySelected"
            @food-selected="foodSelected"
          ></category-contents-view>
        </v-tab-item>
      </v-tabs-items>
      <div v-if="dialog || !showInDialog" class="d-flex flex-column flex-sm-row pa-4 gap-2">
        <v-btn
          v-if="type === 'foodSearch' && searchTerm"
          color="secondary"
          :disabled="missingDialog"
          large
          outlined
          :title="promptI18n.browse"
          @click.stop="searchTerm = ''"
        >
          {{ promptI18n.browse }}
        </v-btn>
        <v-btn
          color="secondary"
          :disabled="missingDialog"
          large
          outlined
          :title="promptI18n['missing.label']"
          @click.stop="openMissingDialog"
        >
          {{ promptI18n['missing.label'] }}
        </v-btn>
      </div>
    </component>
    <missing-food-panel
      v-model="missingDialog"
      :class="{ 'mt-4': isMobile }"
      :i18n="promptI18n"
      @cancel="closeMissingDialog"
      @confirm="foodMissing"
    ></missing-food-panel>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VTextField } from 'vuetify/lib';
import { watchDebounced } from '@vueuse/core';
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import { VCard } from 'vuetify/lib';

import type { Prompt } from '@intake24/common/prompts';
import type { CategoryContents, CategoryHeader, FoodHeader } from '@intake24/common/types/http';
import { usePromptUtils } from '@intake24/survey/composables';
import { categoriesService, foodsService } from '@intake24/survey/services';

import type { FoodSearchPromptParameters } from '../prompts/standard/FoodSearchPrompt.vue';
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
    parameters: {
      type: Object as PropType<FoodSearchPromptParameters>,
    },
    rootCategory: {
      type: String,
    },
    prompt: {
      type: Object as PropType<Prompt>,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
  },

  emits: ['food-selected', 'food-missing', 'input'],

  setup(props, { emit }) {
    const { translatePrompt, type } = usePromptUtils(props);

    const promptI18n = computed(() => {
      return {
        ...translatePrompt(
          [
            'browse',
            'search',
            'root',
            'back',
            'none',
            'missing.label',
            'missing.description',
            'missing.report',
            'missing.tryAgain',
          ],
          {
            back: {
              category:
                navigationHistory.value.length > 1
                  ? navigationHistory.value[navigationHistory.value.length - 2].name
                  : '??',
            },
          }
        ),
      };
    });

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

    const searchTerm = ref(props.value);
    const searchRef = ref<InstanceType<typeof VTextField>>();
    const searchResults = ref<FoodHeader[]>([]);
    const rootHeader = computed(() => ({
      code: props.rootCategory ?? '',
      name: props.rootCategory ?? promptI18n.value.root,
    }));

    const searchContents = computed<CategoryContents>(() => ({
      header: rootHeader.value,
      foods: searchResults.value,
      subcategories: [],
    }));

    const navigationHistory = ref<CategoryHeader[]>([]);
    const retryCode = ref(props.rootCategory);
    const currentCategoryContents = ref<CategoryContents | undefined>(undefined);

    const requestInProgress = ref(true);
    const requestFailed = ref(false);
    const tab = ref(0);

    const browseCategory = async (categoryCode?: string) => {
      requestInProgress.value = true;
      retryCode.value = categoryCode;

      try {
        const contents = await categoriesService.contents(props.localeId, categoryCode);

        requestInProgress.value = false;
        requestFailed.value = false;

        const header = contents.header.code ? contents.header : rootHeader.value;

        currentCategoryContents.value = { ...contents, header };
        navigationHistory.value.push(header);
      } catch (err) {
        requestInProgress.value = false;
        requestFailed.value = true;
      }
    };

    /*
     * TODO: searchCategory and searchGlobal should be merged into a single search
     */
    const searchCategory = async () => {
      if (!props.rootCategory) return;

      requestInProgress.value = true;
      searchResults.value = [];

      try {
        const { data } = await categoriesService.search(props.localeId, props.rootCategory, {
          search: searchTerm.value,
          limit: 25,
        });

        searchResults.value = data;

        requestFailed.value = false;
      } catch (err) {
        requestFailed.value = true;
      } finally {
        requestInProgress.value = false;
      }
    };

    const searchGlobal = async () => {
      if (!props.parameters || !searchTerm.value) return;

      requestInProgress.value = true;
      searchResults.value = [];
      const { matchScoreWeight, rankingAlgorithm } = props.parameters;

      try {
        const { foods } = await foodsService.search(props.localeId, searchTerm.value, {
          rankingAlgorithm,
          matchScoreWeight,
          recipe: false,
        });

        searchResults.value = foods;

        requestFailed.value = false;
      } catch (e) {
        requestFailed.value = true;
      } finally {
        requestInProgress.value = false;
      }
    };

    const search = async () => {
      if (props.rootCategory) await searchCategory();
      else await searchGlobal();
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
      if (searchTerm.value) {
        await search();
        tab.value = 1;
        return;
      }

      await browseCategory(props.rootCategory);
    });

    watchDebounced(
      searchTerm,
      async () => {
        emit('input', searchTerm.value ?? '');

        if (searchTerm.value) {
          await search();
          tab.value = 1;
          return;
        }

        if (
          !currentCategoryContents.value ||
          props.rootCategory !== currentCategoryContents.value.header.code
        )
          await browseCategory(props.rootCategory);

        tab.value = 0;
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
      promptI18n,
      requestInProgress,
      requestFailed,
      tab,
      type,
      browseCategory,
      categorySelected,
      foodMissing,
      foodSelected,
      navigateBack,
      searchTerm,
      searchContents,
      searchRef,
      searchResults,
    };
  },
});
</script>

<style lang="scss"></style>
