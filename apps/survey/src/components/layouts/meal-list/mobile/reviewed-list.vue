<template>
  <div content-class="meal-list-mobile__sheet" scrollable>
    <v-card class="meal-list-mobile__card">
      <div class="py-4 pl-4 pr-3 d-flex flex-row justify-space-between align-center">
        <div class="text-h6 font-weight-medium">{{ $t('recall.menu.title') }}</div>
      </div>
      <v-card-text class="pa-0">
        <v-list class="meal-list__list" dense subheader>
          <div v-for="meal in meals" :key="meal.id">
            <meal-item
              v-bind="{ contextId, meal, selectedMealId, selectedFoodId }"
              :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
              @action="action"
              @update:context-id="updateContextId"
            ></meal-item>
            <v-checkbox
              v-if="showReviewMealListMobileCheckbox"
              v-model="reviewed"
              class="review-checkbox__checkbox pl-3"
              label="Reviewed"
              :value="meal.id"
            ></v-checkbox>
          </div>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import type { MealState } from '@intake24/common/types';
import { useMealUtils } from '@intake24/survey/composables';

import { useMealList } from '../use-meal-list';
import MealItem from './meal-item.vue';

export default defineComponent({
  name: 'MealListMobile',

  components: { MealItem },

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
    showReviewMealListMobileCheckbox: {
      type: Boolean,
      default: false,
    },
    showReviewMealListMobileScroll: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, ctx) {
    const reviewed = ref([]);

    const { selectedMealId, selectedFoodId, isSelectedFoodInMeal, action } = useMealList(
      props,
      ctx
    );

    const { getMealName, getMealTime } = useMealUtils();

    const contextId = ref<string | undefined>(undefined);

    const updateContextId = (id: string) => {
      contextId.value = id === contextId.value ? undefined : id;
    };

    const checkScroll = (entries: IntersectionObserverEntry[]) => {
      const el = entries[0].target as HTMLElement;
      const isBottom = entries[0].isIntersecting;
      const isScrollable = el.scrollHeight > el.clientHeight;
      if (isBottom && (!isScrollable || el.scrollHeight === el.clientHeight)) {
        ctx.emit('reached-bottom-mobile', true);
      }
    };

    let observer: IntersectionObserver | null = null;

    onMounted(() => {
      const el = document.querySelector('.meal-list__list');
      if (el && props.showReviewMealListMobileScroll) {
        observer = new IntersectionObserver(checkScroll, {
          root: null,
          rootMargin: '0px',
          threshold: 1.0,
        });
        observer.observe(el);
      }
    });

    onBeforeUnmount(() => {
      if (observer) {
        observer.unobserve(document.querySelector('.meal-list__list')!);
      }
    });

    watch(reviewed, (newVal) => {
      ctx.emit('update-reviewed', newVal);
    });

    return {
      contextId,
      updateContextId,
      getMealName,
      getMealTime,
      selectedMealId,
      reviewed,
      selectedFoodId,
      isSelectedFoodInMeal,
      action,
      checkScroll,
    };
  },
});
</script>

<style lang="scss">
.review-checkbox__checkbox .v-label {
  font-size: 0.8125rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
}
</style>
