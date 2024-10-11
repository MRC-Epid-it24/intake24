<template>
  <div content-class="meal-list-mobile__sheet" scrollable>
    <v-card class="meal-list-mobile__card" flat>
      <div class="py-4 ps-4 pe-3 d-flex flex-row justify-space-between align-center">
        <div class="text-h6 font-weight-medium">
          {{ $t('recall.menu.title') }}
        </div>
      </div>
      <v-card-text class="pa-0">
        <v-list class="meal-list__list" density="compact">
          <div v-for="meal in meals" :key="meal.id">
            <meal-item
              v-bind="{ contextId, meal, selectedMealId, selectedFoodId }"
              :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
              @action="action"
              @update:context-id="updateContextId"
            />
            <div class="d-flex flex-column pa-4 ga-4">
              <v-checkbox
                v-if="review === 'checkbox'"
                v-model="reviewed"
                class="review-checkbox__checkbox font-weight-medium mt-0"
                hide-details
                :label="$t('recall.actions.reviewed')"
                :value="meal.id"
              />
              <v-hover v-slot="{ isHovering }">
                <v-btn
                  :color="isHovering ? 'primary' : 'inherit'"
                  size="small"
                  :title="$t('recall.menu.meal.editFoods')"
                  variant="flat"
                  @click="action('editMeal', meal.id)"
                >
                  {{ $t('recall.menu.meal.editFoods') }}
                </v-btn>
              </v-hover>
            </div>
          </div>
          <v-card-text v-if="review === 'onecheckbox'">
            <v-checkbox
              v-model="reviewed"
              class="review-checkbox__checkbox font-weight-medium mt-0"
              hide-details
              :label="$t('recall.actions.reviewed')"
            />
          </v-card-text>
        </v-list>
      </v-card-text>
      <div v-if="!bottomReached" v-intersect="bottomIntersect" class="d-hidden" />
    </v-card>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { ReviewOptions } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import { useMealUtils } from '@intake24/survey/composables';

import { useMealList } from '../use-meal-list';
import { useReviewList } from '../use-review-list';
import MealItem from './meal-item.vue';

export default defineComponent({
  name: 'MealListMobile',

  components: { MealItem },

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
    review: {
      type: [String, Boolean] as PropType<ReviewOptions>,
      default: false,
    },
  },

  setup(props, ctx) {
    const { bottomIntersect, bottomReached, reviewed } = useReviewList(props, ctx);
    const { selectedMealId, selectedFoodId, isSelectedFoodInMeal, action } = useMealList(
      props,
      ctx,
    );

    const { getMealName, getMealTime } = useMealUtils();

    const contextId = ref<string | undefined>(undefined);

    const updateContextId = (id: string) => {
      contextId.value = id === contextId.value ? undefined : id;
    };

    return {
      contextId,
      updateContextId,
      getMealName,
      getMealTime,
      selectedMealId,
      bottomIntersect,
      bottomReached,
      reviewed,
      selectedFoodId,
      isSelectedFoodInMeal,
      action,
    };
  },
});
</script>

<style lang="scss"></style>
