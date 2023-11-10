<template>
  <v-card flat>
    <v-card-title>
      {{ $t('recall.menu.title') }}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-actions>
      <v-hover v-slot="{ hover }">
        <v-btn
          class="ma-2"
          :color="hover ? 'primary' : 'inherit'"
          :title="$t('recall.menu.meal.add')"
          @click="action('addMeal')"
        >
          <v-icon left>$add</v-icon>
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
        ></component>
        <v-row class="pl-3">
          <v-col v-if="review === 'checkbox'" cols="auto">
            <v-checkbox
              v-model="reviewed"
              class="review-checkbox__checkbox"
              :label="$t('recall.actions.reviewCheckBox')"
              :value="meal.id"
            ></v-checkbox>
          </v-col>
          <v-col cols="auto">
            <v-hover v-slot="{ hover }">
              <v-btn
                :class="review === 'checkbox' ? 'ma-4' : 'my-2 mx-1'"
                :color="hover ? 'primary' : 'inherit'"
                small
                :title="$t('recall.menu.meal.editFoods')"
                @click="action('editMeal', meal.id)"
              >
                {{ $t('recall.menu.meal.editFoods') }}
              </v-btn>
            </v-hover>
          </v-col>
        </v-row>
      </div>
      <v-checkbox
        v-if="review === 'onecheckbox'"
        v-model="reviewed"
        class="pl-3 review-checkbox__checkbox"
        :label="$t('recall.actions.reviewCheckBox')"
      ></v-checkbox>
    </v-list>
    <v-card-actions v-if="!bottomReached" v-intersect="bottomIntersect">
      <v-hover v-slot="{ hover }">
        <v-btn
          block
          :color="hover ? 'primary' : 'inherit'"
          depressed
          :title="$t('recall.menu.meal.add')"
          @click="action('addMeal')"
        >
          <v-icon left>$add</v-icon>
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
      ctx
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
.review-checkbox__checkbox .v-label {
  font-size: 0.95rem;
  font-weight: bold;
  color: #ee672d;
}
</style>
