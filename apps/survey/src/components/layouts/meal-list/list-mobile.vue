<template>
  <v-bottom-sheet>
    <template #activator="{ on, attrs }">
      <v-btn value="review" v-bind="attrs" v-on="on">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.review') }}
        </span>
        <v-icon class="pb-1">$survey</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
    </template>
    <v-list>
      <v-subheader>{{ $t('recall.menu.title') }}</v-subheader>
      <v-list class="meal-list pt-0" dense flat tile>
        <template v-for="meal in meals">
          <component
            :is="expandable ? 'meal-item-expandable' : 'meal-item'"
            :key="meal.id"
            :meal="meal"
            :selected="selectedMealId === meal.id"
            :selected-food-id="selectedFoodId"
            :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
            @action="action"
            @food-selected="foodSelected"
            @meal-selected="mealSelected"
          ></component>
        </template>
      </v-list>
    </v-list>
  </v-bottom-sheet>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { useMealUtils } from '@intake24/survey/composables';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndexRequired } from '@intake24/survey/util';

import MealItem from './meal-item.vue';
import MealItemExpandable from './meal-item-expandable.vue';

export default defineComponent({
  name: 'MealListMobile',

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
  },

  emits: ['action'],

  setup() {
    const { translate } = useI18n();
    const { getMealTime } = useMealUtils();

    return { translate, getMealTime };
  },

  computed: {
    ...mapState(useSurvey, ['selection']),

    selectedMealId() {
      if (this.selection.element?.type !== 'meal') return undefined;
      return this.selection.element.mealId;
    },
    selectedFoodId() {
      if (this.selection.element?.type !== 'food') return undefined;
      return this.selection.element.foodId;
    },
  },

  methods: {
    isSelectedFoodInMeal(mealId: string): boolean {
      if (this.selection.element?.type !== 'food') return false;

      const foodIndex = getFoodIndexRequired(this.meals, this.selection.element.foodId);

      return this.meals[foodIndex.mealIndex].id === mealId;
    },
    action(type: FoodActionType | MealActionType, id?: string) {
      this.$emit('action', type, id);
    },
    foodSelected(foodId: string) {
      this.action('selectFood', foodId);
    },
    mealSelected(mealId: string) {
      this.action('selectMeal', mealId);
    },
  },
});
</script>

<style lang="scss">
@import 'vuetify/src/styles/styles.sass';

.meal-list {
  .selected {
    background: map-get($orange, 'lighten-5');
  }

  .selected-food {
    background: map-get($orange, 'lighten-4');
  }

  .v-list-group__header {
    padding-left: 12px !important;
  }

  .v-list-item:hover {
    background: map-get($orange, 'lighten-5');
  }

  .v-list-group--active > .v-list-group__header > .v-list-group__header__prepend-icon {
    margin-right: 6px;

    .v-icon {
      transform: rotate(180deg);
    }
  }

  .v-list-group__header__append-icon {
    display: none !important;
  }
}
</style>
