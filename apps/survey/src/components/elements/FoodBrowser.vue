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
              <v-btn large @click="browseCategory(retryCode, false)">Try again</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-if="recipeBuilderToggle" flat>
            <v-card-text>
              <v-btn
                :block="isMobile"
                :class="{ 'ml-2': !isMobile }"
                color="secondary"
                :disabled="!recipeBuilderToggle"
                large
                outlined
                :v-model="recipeBuilderFood?.name"
                @click.stop="recipeBuilder"
              >
                {{
                  $t(`prompts.${type}.recipeBuilder.label`, {
                    searchTerm: recipeBuilderFood?.name,
                  })
                }}
              </v-btn>
            </v-card-text>
          </v-card>
          <v-btn v-if="navigationHistory.length > 0" large text @click="navigateBack">
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
            :categories-first="false"
            :contents="searchContents"
            :i18n="promptI18n"
            @category-selected="categorySelected"
            @food-selected="foodSelected"
          ></category-contents-view>
        </v-tab-item>
      </v-tabs-items>
      <div v-if="dialog || !showInDialog" class="d-flex flex-column flex-sm-row pa-4 ga-2">
        <v-btn
          v-if="type === 'foodSearch' && tab === 1"
          color="primary"
          :disabled="missingDialog"
          large
          outlined
          :title="promptI18n.browse"
          @click.stop="browseRootCategory"
        >
          {{ promptI18n.browse }}
        </v-btn>
        <v-btn
          color="primary"
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
import type { RecipeFood } from '@intake24/common/types';
import type {
  CategoryContents,
  CategoryHeader,
  FoodHeader,
  FoodSearchResponse,
} from '@intake24/common/types/http';
import { usePromptUtils } from '@intake24/survey/composables';
import { categoriesService, foodsService } from '@intake24/survey/services';

import type { FoodSearchPromptParameters } from '../prompts';
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
      type: String as PropType<string | null>,
      default: '',
    },
  },

  emits: ['food-selected', 'food-missing', 'recipe-builder', 'input'],

  setup(props, { emit }) {
    const { translatePrompt, type } = usePromptUtils(props);

    const promptI18n = computed(() => {
      function backCategoryLabel(): string {
        if (navigationHistory.value.length === 0) return '??';

        const last = navigationHistory.value[navigationHistory.value.length - 1];

        if (last === 'search') return 'Search results';

        return last.name;
      }

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
              category: backCategoryLabel(),
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
    const searchResults = ref<FoodSearchResponse>({ foods: [], categories: [] });
    const rootHeader = computed(() => ({
      code: props.rootCategory ?? '',
      name: props.rootCategory ?? promptI18n.value.root,
    }));

    const searchContents = computed<CategoryContents>(() => ({
      header: rootHeader.value,
      foods: searchResults.value.foods,
      subcategories: searchResults.value.categories,
    }));

    const navigationHistory = ref<('search' | CategoryHeader)[]>([]);
    const retryCode = ref(props.rootCategory);
    const currentCategoryContents = ref<CategoryContents | undefined>(undefined);

    const requestInProgress = ref(true);
    const requestFailed = ref(false);
    const recipeBuilderFood = ref<FoodHeader | null>(null);
    const recipeFood = ref<RecipeFood | null>(null);
    const recipeBuilderToggle = ref(false);
    const tab = ref(0);

    const browseRootCategory = () => {
      browseCategory(props.rootCategory, true);
    };

    const browseCategory = async (categoryCode: string | undefined, makeHistoryEntry: boolean) => {
      requestInProgress.value = true;
      retryCode.value = categoryCode;
      tab.value = 0;

      try {
        const contents = await categoriesService.contents(props.localeId, categoryCode);

        requestInProgress.value = false;
        requestFailed.value = false;

        const header = contents.header.code ? contents.header : rootHeader.value;

        if (makeHistoryEntry) {
          if (currentCategoryContents.value !== undefined) {
            navigationHistory.value.push(currentCategoryContents.value.header);
          } else {
            navigationHistory.value.push('search');
          }
        }

        currentCategoryContents.value = { ...contents, header };
      } catch (err) {
        requestInProgress.value = false;
        requestFailed.value = true;
      }
    };

    const recipeBuilderDetected = async (recipeFood: FoodHeader) => {
      requestInProgress.value = true;
      try {
        const recipefoodData = await foodsService.getRecipeFood(props.localeId, recipeFood.code);
        console.log(`Got some Builder Food ${JSON.stringify(recipefoodData)}`);
        recipeFood = recipefoodData;
        recipeBuilderToggle.value = true;
      } catch (e) {
        requestFailed.value = true;
      }
      requestInProgress.value = false;
    };

    const search = async () => {
      if (!props.parameters || !searchTerm.value) return;

      requestInProgress.value = true;
      recipeBuilderToggle.value = false;
      searchResults.value = { foods: [], categories: [] };
      const { matchScoreWeight, rankingAlgorithm } = props.parameters;

      try {
        searchResults.value = await foodsService.search(props.localeId, searchTerm.value, {
          rankingAlgorithm,
          matchScoreWeight,
          recipe: false,
          category: props.rootCategory,
        });
        if (searchResults.value.foods[0].code.charAt(0) === '$') {
          recipeBuilderFood.value = searchResults.value.foods.splice(0, 1)[0];
          recipeBuilderDetected(recipeBuilderFood.value);
        }
        requestFailed.value = false;
      } catch (e) {
        requestFailed.value = true;
      } finally {
        requestInProgress.value = false;
      }
    };

    const categorySelected = (category: CategoryHeader) => {
      browseCategory(category.code, true);
    };

    const foodSelected = (food: FoodHeader) => {
      closeInDialog();
      emit('food-selected', food);
    };

    const foodMissing = (food: FoodHeader) => {
      closeInDialog();
      emit('food-missing', food);
    };

    const recipeBuilder = () => {
      closeInDialog();
      emit('recipe-builder', recipeFood);
    };

    const navigateBack = () => {
      if (navigationHistory.value.length === 0) {
        console.warn('Navigation history is empty');
        return;
      }

      const lastItem = navigationHistory.value[navigationHistory.value.length - 1];
      navigationHistory.value = navigationHistory.value.slice(
        0,
        navigationHistory.value.length - 1
      );

      if (lastItem === 'search') {
        tab.value = 1;
        currentCategoryContents.value = undefined;
      } else {
        tab.value = 0;
        browseCategory(lastItem.code, false);
      }
    };

    onMounted(async () => {
      if (searchTerm.value) {
        await search();
        tab.value = 1;
        return;
      }

      await browseCategory(props.rootCategory, false);
    });

    watchDebounced(
      searchTerm,
      async () => {
        emit('input', searchTerm.value ?? '');

        if (searchTerm.value) {
          await search();
          currentCategoryContents.value = undefined;
          navigationHistory.value = [];
          tab.value = 1;
          return;
        }

        if (
          !currentCategoryContents.value ||
          props.rootCategory !== currentCategoryContents.value.header.code
        )
          await browseCategory(props.rootCategory, true);
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
      recipeBuilderFood,
      recipeFood,
      recipeBuilderToggle,
      tab,
      type,
      browseRootCategory,
      browseCategory,
      categorySelected,
      foodMissing,
      foodSelected,
      navigateBack,
      recipeBuilder,
      searchTerm,
      searchContents,
      searchRef,
      searchResults,
    };
  },
});
</script>

<style lang="scss"></style>
