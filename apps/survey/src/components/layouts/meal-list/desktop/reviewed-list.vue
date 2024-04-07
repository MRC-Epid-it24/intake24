<template>
  <v-card flat>
    <v-card-title>
      {{ $t('recall.menu.title') }}
    </v-card-title>
    <v-divider />
    <v-card-actions>
      <v-hover v-slot="{ hover }">
        <v-btn
          class="ma-2"
          :color="hover ? 'primary' : 'inherit'"
          depressed
          :title="$t('recall.menu.meal.add')"
          @click="action('addMeal')"
        >
          <v-icon left>
            $add
          </v-icon>
          {{ $t('recall.menu.meal.add') }}
        </v-btn>
      </v-hover>
    </v-card-actions>
    <v-list class="meal-list__list pt-0" dense flat tile>
      <div v-for="meal in meals" :key="meal.id">
        <component
          :is="expandable ? 'meal-item-expandable' : 'meal-item'"
          v-bind="{ meal, selectedMealId, selectedFoodId }"
          :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
          @action="action"
        />
        <div class="d-flex flex-row pa-4 ga-4">
          <v-checkbox
            v-if="review === 'checkbox'"
            v-model="reviewed"
            class="review-checkbox__checkbox font-weight-medium mt-0"
            hide-details
            :label="$t('recall.actions.reviewed')"
            :value="meal.id"
          />
          <v-hover v-slot="{ hover }">
            <v-btn
              :color="hover ? 'primary' : 'inherit'"
              depressed
              small
              :title="$t('recall.menu.meal.editFoods')"
              @click="action('editMeal', meal.id)"
            >
              {{ $t('recall.menu.meal.editFoods') }}
            </v-btn>
          </v-hover>
        </div>
      </div>
    </v-list>
    <v-card-text v-if="review === 'onecheckbox'">
      <v-checkbox
        v-model="reviewed"
        class="review-checkbox__checkbox font-weight-medium mt-0"
        hide-details
        :label="$t('recall.actions.reviewed')"
      />
    </v-card-text>
    <v-card-actions v-if="!bottomReached" v-intersect="bottomIntersect">
      <v-hover v-slot="{ hover }">
        <v-btn
          block
          :color="hover ? 'primary' : 'inherit'"
          depressed
          :title="$t('recall.menu.meal.add')"
          @click="action('addMeal')"
        >
          <v-icon left>
            $add
          </v-icon>
          {{ $t('recall.menu.meal.add') }}
        </v-btn>
      </v-hover>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ReviewOptions } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';

import { useMealList } from '../use-meal-list';
import { useReviewList } from '../use-review-list';
import MealItem from './meal-item.vue';
import MealItemExpandable from './meal-item-expandable.vue';

export default defineComponent({
  name: 'ReviewMealList',

  components: { MealItem, MealItemExpandable },

  props: {
    expandable: {
      type: Boolean,
      default: false,
    },
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

    return {
      bottomIntersect,
      bottomReached,
      reviewed,
      selectedMealId,
      selectedFoodId,
      isSelectedFoodInMeal,
      action,
    };
  },
});
</script>

<style lang="scss">
@import 'src/scss/variables';

.review-checkbox__checkbox .v-label {
  font-size: 0.95rem;
  color: $primary;
}
</style>
